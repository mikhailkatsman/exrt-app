import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native"
// import { getLocales } from 'react-native-localize';
import { View, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Calendar from "@components/calendar/Calendar";
import Routine from "@components/routine/Routine";
import DB from '@modules/DB'
import type { RootStackParamList } from "App";
import ScreenWrapper from "@components/common/ScreenWrapper";
import TutorialModalContainer from "@components/common/TutorialModalContainer";
import { CopilotStep, useCopilot } from "react-native-copilot";
import tourTextData from "@modules/TourTextData";

type Props = NativeStackScreenProps<RootStackParamList, 'Hub'>

const screenWidth = Dimensions.get('screen').width
const dateNow: Date = new Date()
const dayNow = (dateNow.getDay() + 6) % 7

const HubScreen: React.FC<Props> = ({ route }) => {
  const isFirstTimeProp = route.params?.isFirstTime ?? false

  const [dataArray, setDataArray] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [mondayDate, setMondayDate] = useState<string>('')
  const [copilotActive, setCopilotActive] = useState<boolean>(false)
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false)
  const [locale, setLocale] = useState<string>('en-GB')
  const [tutorialModalActive, setTutorialModalActive] = useState<boolean>(false)

  const copilot = useCopilot()
  const isFocused = useIsFocused()

  const fetchRoutineData = () => {
    DB.sql(`
      SELECT psi.day_id,
          GROUP_CONCAT(sessions.id, ',') AS session_ids,
          GROUP_CONCAT(sessions.name, ',') AS session_names,
          GROUP_CONCAT(sessions.status, ',') AS session_statuses,
          GROUP_CONCAT(sessions.custom, ',') AS session_customs,
          GROUP_CONCAT(phases.id, ',') AS phase_ids,
          GROUP_CONCAT(phases.name, ',') AS phase_names,
          GROUP_CONCAT(programs.id, ',') AS program_ids,
          GROUP_CONCAT(programs.name, ',') AS program_names,
          GROUP_CONCAT(programs.thumbnail, ',') AS program_thumbnails
      FROM phase_session_instances psi
      JOIN sessions ON psi.session_id = sessions.id
      JOIN phases ON psi.phase_id = phases.id AND phases.status = 'active'
      JOIN program_phases pp ON phases.id = pp.phase_id
      JOIN programs ON pp.program_id = programs.id
      GROUP BY psi.day_id;
    `, [],
      (_, result) => {
        let resultArray = result.rows._array

        resultArray.forEach((item, itemIndex) => {
          const sessionStatuses = item.session_statuses.split(',')

          if (item.day_id < dayNow + 1) {
            sessionStatuses.forEach((status: string, statusIndex: number) => {
              if (status === 'upcoming') sessionStatuses[statusIndex] = 'missed'
            })
          }

          resultArray[itemIndex].session_statuses = sessionStatuses.join(',')
        })

        setDataArray(resultArray)


      })
  }

  useEffect(() => {
    if (isFirstTime && !copilotActive) {
      const timeout = setTimeout(() => {
        setCopilotActive(true)
        copilot.start('calendar')
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [copilotActive, copilot, isFirstTime])

  useEffect(() => {
    if (isFirstTimeProp) {
      setTimeout(() => {
        setTutorialModalActive(true)
      }, 400)
    }
  }, [])

  useEffect(() => {
    setSelectedDay(isFirstTimeProp ? 6 : dayNow)

    DB.sql(`
      SELECT value
      FROM metadata
      WHERE key = 'last_reset';
    `, [],
      (_, result) => {
        setMondayDate(result.rows.item(0).value)
      })
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetchRoutineData()
    } else if (copilotActive) {
      setIsFirstTime(false)
      setCopilotActive(false)
    }
  }, [isFocused])

  const CopilotCalendar = ({ copilot }: any) => (
    <View className="w-full absolute h-24 z-50 border border-custom-green" {...copilot} />
  )

  return (
    <>
      <TutorialModalContainer 
        active={tutorialModalActive}
        text={tourTextData.hubScreenModalText}
        setTutorialModalActive={setTutorialModalActive}
        setIsFirstTime={setIsFirstTime}
      />
      <ScreenWrapper>
        <View className="flex-1 mb-3">
          {isFirstTimeProp &&
            <CopilotStep text={tourTextData.copilotStepText5} order={5} name="calendar">
              <CopilotCalendar />
            </CopilotStep>
          }
          <Calendar
            isFirstTime={isFirstTimeProp}
            dataArray={dataArray}
            dayNow={dayNow}
            setSelectedDay={setSelectedDay}
            screenWidth={screenWidth}
          />
          <Routine
            isFirstTime={isFirstTimeProp}
            dataArray={dataArray}
            selectedDay={selectedDay}
            screenWidth={screenWidth}
            mondayDate={mondayDate}
            locale={locale}
          />
        </View>
      </ScreenWrapper>
    </>
  )
}

export default HubScreen

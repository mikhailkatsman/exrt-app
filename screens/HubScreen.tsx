import { useState, useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Calendar from "@components/calendar/Calendar";
import Routine from "@components/routine/Routine";
import DB from '@modules/DB'
import type { RootStackParamList } from "App";
import ScreenWrapper from "@components/common/ScreenWrapper";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const screenWidth = Dimensions.get('screen').width

const HubScreen: React.FC<Props> = ({ navigation }) => {
  const [dataArray, setDataArray] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number>(0)

  const dayNow = useMemo(() => {
    const dateNow: Date = new Date()
    const dayIndex = (dateNow.getDay() + 6) % 7

    return dayIndex
  }, [])

  const fetchRoutineData = () => {
    DB.sql(`
      SELECT psi.day_id,
          GROUP_CONCAT(sessions.id, ',') AS session_ids,
          GROUP_CONCAT(sessions.name, ',') AS session_names,
          GROUP_CONCAT(sessions.status, ',') AS session_statuses,
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
    setSelectedDay(dayNow)

    const unsubscribeFocus = navigation.addListener('focus', fetchRoutineData)
    return () => { unsubscribeFocus() }
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <Calendar 
          dataArray={dataArray}
          dayNow={dayNow}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          screenWidth={screenWidth}
        /> 
        <Routine 
          dataArray={dataArray}
          selectedDay={selectedDay}
          screenWidth={screenWidth}
        />
      </View>
    </ScreenWrapper>
  )
}

export default HubScreen

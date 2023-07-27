import { useState, useEffect, useMemo, ComponentType } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Calendar from "@components/calendar/Calendar";
import Routine from "@components/routine/Routine";
import Actions from "@components/actions/Actions";
import DB from '@modules/DB'

import type { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const HubScreen: ComponentType<Props> = ({ navigation }) => {
  const [dayNow, setDayNow] = useState<number>(0)
  const [dataArray, setDataArray] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number>(0)

  const fetchRoutineData = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        SELECT weekly_session_instances.day_id AS day_id,
               GROUP_CONCAT(sessions.id, ',') AS session_ids,
               GROUP_CONCAT(sessions.time, ',') AS session_times
        FROM weekly_session_instances
        JOIN sessions ON weekly_session_instances.session_id = sessions.id
        GROUP BY weekly_session_instances.id, weekly_session_instances.day_id;
      `, [], (_, result) => setDataArray(result.rows._array)) 
    })
  }

  useMemo(() => {
    const dateData: Date = new Date()
    const dayNowData: number = (dateData.getDay() + 6) % 7 
    setDayNow(dayNowData)
  }, [])

  useEffect(() => {
    setSelectedDay(dayNow)
    console.log('day set')
  }, [])

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchRoutineData)
    return () => { unsubscribeFocus() }
  }, [])

  return (
    <GestureHandlerRootView className="bg-custom-dark h-full w-full px-2">
      <Calendar 
        dataArray={dataArray}
        dayNow={dayNow}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      /> 
      <Routine 
        dataArray={dataArray}
        selectedDay={selectedDay}
      />
      <Actions
        selectedDay={selectedDay + 1}
      />
    </GestureHandlerRootView>
  )
}

export default HubScreen

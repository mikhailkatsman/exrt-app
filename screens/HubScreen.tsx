import { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Calendar from "@components/calendar/Calendar";
import Routine from "@components/routine/Routine";
import SessionTimePicker from "@components/actions/SessionTimePicker";
import DB from '@modules/DB'
import type { RootStackParamList } from "App";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const HubScreen: React.FC<Props> = ({ navigation }) => {
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
        GROUP BY weekly_session_instances.day_id;
      `, [], 
      (_, result) => {
        console.log(result.rows._array)
        setDataArray(result.rows._array)
      }) 
    })
  }

  const getTimes = (selectedDay: number, dataArray: any[]) => {
    const result = dataArray.find(item => item.day_id === selectedDay)

    return result ? result.session_times.split(',') : []
  }

  useMemo(() => {
    const dateData: Date = new Date()
    const dayNowData: number = (dateData.getDay() + 6) % 7 
    setDayNow(dayNowData)
  }, [])

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
        /> 
        <Routine 
          dataArray={dataArray}
          selectedDay={selectedDay}
        />
      </View>
      <BottomBarWrapper>
        <TouchableOpacity className="
          flex-1 border-2 border-custom-white
          flex-row items-center justify-center 
          rounded-xl"
        >
          <Text className="text-xs text-custom-white mr-2 font-BaiJamjuree-Bold">Move Routine</Text>
          <Icon name="swap-horizontal" color="#F5F6F3" size={24} /> 
        </TouchableOpacity>
        <View className="w-3" />
        <SessionTimePicker 
          selectedDay={selectedDay + 1} 
          sessionTimes={getTimes(selectedDay + 1, dataArray)}
        />
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default HubScreen

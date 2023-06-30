import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Icon } from "@react-native-material/core";
import Calendar from "../components/calendar/Calendar";
import Routine from "../components/routine/Routine";
import db from '../modules/DB'
import Actions from "../components/actions/Actions";

const Hub: React.FC = () => {
  const [dayNow, setDayNow] = useState<number>(0)
  const [dataArray, setDataArray] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number>(dayNow)

  useEffect(() => {
    const dateData: Date = new Date()
    const dayNowData: number = (dateData.getDay() + 6) % 7 
    setDayNow(dayNowData)

    db.sql(`
      SELECT weekly_session_instances.day_id AS day_id,
             GROUP_CONCAT(sessions.id, ',') AS session_ids,
             GROUP_CONCAT(sessions.time, ',') AS session_times
      FROM weekly_session_instances
      JOIN sessions ON weekly_session_instances.session_id = sessions.id
      GROUP BY weekly_session_instances.id, weekly_session_instances.day_id;
      `, [],
      (_, result) => {
        setDataArray(result.rows._array)
      }
    ) 
  }, [])


  return (
    <>
      <SafeAreaView className="h-[10%] py-3 items-end justify-between bg-custom-dark flex-row">
        <View className="flex-row">
          <TouchableOpacity className="px-4">
            <Icon name="chevron-left" color="#F5F5F3" size={32} />
          </TouchableOpacity>
          <Text className="text-custom-white text-2xl font-bold">Hub</Text> 
        </View>
        <TouchableOpacity className="px-4">
          <Icon name="dots-horizontal" color="#F5F6F3" size={30} />
        </TouchableOpacity>
      </SafeAreaView>
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
          selectedDay={selectedDay}
        />
      </GestureHandlerRootView>
    </>
  )
}

export default Hub

import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Calendar from "../components/calendar/Calendar";
import Routine from "../components/routine/Routine";
import db from '../modules/DB'
import { Icon, IconButton } from "@react-native-material/core";

const Hub: React.FC = () => {
  const dayNow: number = (new Date().getDay() + 6) % 7 
  const [dataArray, setDataArray] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number>(dayNow)

  useEffect(() => {
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
      <SafeAreaView className="h-[10%] px-4 py-3 items-end justify-between bg-custom-dark flex-row">
        <Text className="text-custom-white text-2xl font-bold">Hub</Text> 
        <TouchableOpacity>
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
      </GestureHandlerRootView>
    </>
  )
}

export default Hub

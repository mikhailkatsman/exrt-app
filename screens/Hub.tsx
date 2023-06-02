import { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import Calendar from "../components/calendar/Calendar";
import Routine from "../components/routine/Routine";
import db from '../modules/DB'

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
      <SafeAreaView className="h-24 p-2 bg-custom-dark">
        <Text className="text-custom-white text-2xl">Hub</Text> 
      </SafeAreaView>
      <View className="bg-custom-dark h-full w-full px-2">
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
    </>
  )
}

export default Hub

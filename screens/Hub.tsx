import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import Calendar from "../components/calendar/Calendar";
import Routine from "../components/routine/Routine";
import db from '../modules/DB'

const Hub: React.FC = () => {
  useEffect(() => {
    db.initDatabase().then(() => {
      console.log(db.getWeeklyData())
    })
  }, [])

  const dateNow: Date = new Date()

  return (
    <>
      <SafeAreaView className="h-24 p-2 bg-custom-dark">
        <Text className="text-custom-white text-2xl">Hub</Text> 
      </SafeAreaView>
      <View className="bg-custom-dark h-full w-full px-2">
        <Calendar 
          date={dateNow}
        /> 
        <Routine 
          date={dateNow}
        />
      </View>
    </>
  )
}

export default Hub

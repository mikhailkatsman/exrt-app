import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import Calendar from "../components/calendar/Calendar";
import Routine from "../components/routine/Routine";

const Hub: React.FC = () => {
  return (
    <>
      <SafeAreaView className="h-24 p-2 bg-custom-dark">
        <Text className="text-custom-white text-2xl">Hub</Text> 
      </SafeAreaView>
      <View className="bg-custom-dark h-full w-full px-2">
        <Calendar /> 
        <Routine />
      </View>
    </>
  )
}

export default Hub

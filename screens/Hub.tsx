import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import Calendar from "../components/calendar/Calendar";

const Hub: React.FC = () => {
  return (
    <>
    <SafeAreaView className="h-24 p-2 bg-black">
      <Text className="text-white text-2xl">Hub</Text> 
    </SafeAreaView>
    <View className="bg-black h-full w-full p-2 flex">
      <Calendar /> 
    </View>
    </>
  )
}

export default Hub

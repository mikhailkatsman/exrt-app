import React from "react"
import { TouchableOpacity, ImageBackground, Text, View } from "react-native"

type Props = {
  routine: { time: string, id: string }
}

const TimeSlot: React.FC<Props> = ({ routine }) => {
  return (
    <View className="flex-row h-1/4 mb-3">
      <View className="mr-1 justify-center">
        <Text className="text-custom-blue text-lg">{routine.time}</Text>
      </View>
      <View className="w-[8%] h-1/2 border-b border-custom-blue"/>
      <TouchableOpacity
        className="flex-1 overflow-hidden rounded-xl border border-custom-blue"
      >
        <ImageBackground
          source={require('../../assets/images/bg/routine-workout-bg.png')}
          className="p-2"
          resizeMode="cover"
        >
          <Text className="text-custom-white text-lg">Upcoming Session id-{routine.id}</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default TimeSlot

import React, { useState } from "react"
import { TouchableOpacity, ImageBackground, Text, View, ScrollView } from "react-native"

type Props = {
  routine: { time: string, id: string }
}

const TimeSlot: React.FC<Props> = ({ routine }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <View className="flex-row h-1/4">
      <View className="w-[17%] pr-1 justify-center">
        <Text className="text-custom-blue text-lg">{routine.time}</Text>
      </View>
      <View className="w-[8%] h-1/2 border-b-2 border-custom-blue"/>
      <TouchableOpacity
        className="
          w-[75%] flex-col overflow-hidden
          justify-between rounded-xl
          border bg-custom-blue border-custom-blue
        "
        activeOpacity={1}
      >
          <Text className="m-2 text-custom-white text-lg">Upcoming Session</Text>
          <View className="h-2/3 rounded-xl bg-custom-dark">

          </View>
      </TouchableOpacity>
    </View>
  )
}

export default TimeSlot

import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import TimeSlotList from "./TimeSlotList"

type Props = {
  dataArray: any[]
  selectedDay: number 
}

const Routine: React.FC<Props> = ({ dataArray, selectedDay }) => {
  return (
    <View className="
      h-[65%] my-2
      flex-col
      bg-custom-white
      overflow-hidden
      border rounded-xl border-custom-white
    ">
      <View className="h-[10%] p-2">
        <Text className="text-custom-dark text-xs">Routines for the day:</Text>
        <Text className="text-custom-dark text-xs">20/09/2023</Text>
      </View>
      <TimeSlotList 
        dataArray={dataArray} 
        selectedDay={selectedDay} 
      />
    </View>
  )
}

export default Routine

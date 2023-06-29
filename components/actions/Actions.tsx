import { Icon } from "@react-native-material/core"
import React from "react"
import { View, Text, TouchableOpacity } from "react-native"

type Props = {
  selectedDay: number,
}

const Actions: React.FC<Props> = ({ selectedDay }) => {
  return (
    <View className="h-[8%] w-full mt-2 flex-row justify-between">
      <TouchableOpacity className="
	h-full mr-1
	flex-1 items-center justify-center 
	rounded-xl bg-custom-white"
      >
	<Text>button</Text>
	<Icon name="plus" color="#080B06" size={24} /> 
      </TouchableOpacity>
      <TouchableOpacity className="
	h-full mx-1
	flex-1 items-center justify-center 
	rounded-xl bg-custom-white"
      >
	<Text>button</Text>
	<Icon name="plus" color="#080B06" size={24} /> 
      </TouchableOpacity>
      <TouchableOpacity className="
	h-full ml-1
	flex-1 items-center justify-center 
	rounded-xl bg-custom-white"
      >
	<Text>button</Text>
	<Icon name="plus" color="#080B06" size={24} /> 
      </TouchableOpacity>
    </View>
  )
}

export default Actions

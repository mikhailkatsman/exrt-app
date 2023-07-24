import { Icon } from "@react-native-material/core"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { View, Text, TouchableOpacity } from "react-native"

type Props = {
  selectedDay: number,
}

const Actions: React.FC<Props> = ({ selectedDay }) => {
  const navigation = useNavigation()
  const createNewSession = () => {
    navigation.navigate("NewSession", { routineId: selectedDay })
  }

  return (
    <View className="h-[8%] w-full mt-2 flex-row justify-between">
      <TouchableOpacity className="
	h-full mr-1
	flex-1 items-center justify-center 
	rounded-xl bg-custom-white"
      >
	<Text className="text-xs font-bold mb-1">Move Routine</Text>
	<Icon name="swap-horizontal" color="#080B06" size={24} /> 
      </TouchableOpacity>
      <TouchableOpacity className="
	h-full mx-1
	flex-1 items-center justify-center 
	rounded-xl bg-custom-white"
	onPress={createNewSession}
      >
	<Text className="text-xs font-bold mb-1">Create New Session</Text>
	<Icon name="dumbbell" color="#080B06" size={22} /> 
      </TouchableOpacity>
    </View>
  )
}

export default Actions

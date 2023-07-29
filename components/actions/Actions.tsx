import { Icon } from "@react-native-material/core"
import { View, Text, TouchableOpacity } from "react-native"
import SessionTimePicker from "@components/actions/SessionTimePicker"

type Props = {
  selectedDay: number,
}

const Actions: React.FC<Props> = ({ selectedDay }) => {
  return (
    <View className="h-[8%] w-full mt-2 flex-row justify-between">
      <TouchableOpacity className="
	h-14 mr-2 border-2 border-custom-white
	flex-1 items-center justify-center 
	rounded-xl bg-custom-white"
      >
	<Text className="text-xs mb-1 font-BaiJamjuree-Bold">Move Routine</Text>
	<Icon name="swap-horizontal" color="#080B06" size={24} /> 
      </TouchableOpacity>
      <SessionTimePicker selectedDay={selectedDay} />
    </View>
  )
}

export default Actions

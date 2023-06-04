import { View, Text } from "react-native"
import TimeSlotList from "./TimeSlotList"

type Props = {
  dataArray: any[]
  selectedDay: number 
}

const Routine: React.FC<Props> = ({ dataArray, selectedDay }) => {
  return (
    <View className="h-2/3 py-1 my-1">
      <View className="w-full h-full border overflow-hidden rounded-xl border-custom-white">
	<View className="bg-custom-white w-full p-2 h-[10%]">
	  <Text className="text-custom-dark text-xs">20/09/2023</Text>
	</View>
	<TimeSlotList dataArray={dataArray} selectedDay={selectedDay} />	
      </View>
    </View>
  )
}

export default Routine

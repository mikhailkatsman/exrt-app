import { View, Text } from "react-native"
import TimeSlotList from "./TimeSlotList"

type Props = {
  dataArray: any[],
  selectedDay: number, 
}

const Routine: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const week: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <View className="
      flex-1 flex-col p-2
      rounded-xl border-y border-custom-white"
    >
      <View className="h-[7%] flex justify-center">
        <Text className="text-custom-white font-BaiJamjuree-Bold">{week[selectedDay]} Routine</Text>
      </View>
      <TimeSlotList 
        dataArray={dataArray} 
        selectedDay={selectedDay} 
      />
    </View>
  )
}

export default Routine

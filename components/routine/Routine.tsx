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
      h-[76%] my-2
      flex-col
      bg-custom-white
      overflow-hidden
      border rounded-xl border-custom-white"
    >
      <View className="h-[8%] px-2 flex justify-center">
        <Text className="text-custom-dark text-md font-bold">{week[selectedDay]} Routine</Text>
      </View>
      <TimeSlotList 
        dataArray={dataArray} 
        selectedDay={selectedDay} 
      />
    </View>
  )
}

export default Routine

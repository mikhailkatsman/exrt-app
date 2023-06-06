import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import TimeSlotList from "./TimeSlotList"

type Props = {
  dataArray: any[]
  selectedDay: number 
}

const Routine: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const [timeSignatureArray, setTimeSignatureArray] = useState<string[]>([])

  useEffect(() => {
    const timeSignatures: string[] = []
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, '0')
      timeSignatures.push(`${formattedHour}:00`)
    }

    setTimeSignatureArray(timeSignatures)

    // DEBUG MESSAGE
    console.log('TIMESIGNATURE ARRAY GENERATED')
  }, [])

  return (
    <View className="h-2/3 py-1 my-1">
      <View className="w-full h-full border overflow-hidden rounded-xl border-custom-white">
	<View className="bg-custom-white w-full p-2 h-[10%]">
	  <Text className="text-custom-dark text-xs">20/09/2023</Text>
	</View>
	{timeSignatureArray.length > 0 && dataArray.length > 0 && selectedDay !== null && (
          <TimeSlotList 
            dataArray={dataArray} 
            selectedDay={selectedDay} 
            timeSignatureArray={timeSignatureArray}
          />
        )}
      </View>
    </View>
  )
}

export default Routine

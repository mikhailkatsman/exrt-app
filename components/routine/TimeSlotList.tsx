import { useEffect, useState } from "react"
import { View, Text, ImageBackground } from "react-native"
import TimeSlot from "./TimeSlot"

type Props = {
  dataArray: any[],
  selectedDay: number,
}

const TimeSlotList: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const [routinesArray, setRoutinesArray] = useState<any[]>([])
  useEffect(() => {
    const filteredData: any[] = dataArray
      .filter(data => data.day_id === selectedDay + 1)
      .map(item => {
	const sessions = item.session_ids.split(',')
	const times = item.session_times.split(',')
	return sessions.map((sessionId: string, index: number) => ({
	  id: sessionId,
	  time: times[index]
	}))
      })
      .flat()

    setRoutinesArray(filteredData)

  }, [dataArray, selectedDay])

  return (
    <View className="w-full h-full p-3"> 
      {routinesArray.length === 0 ? (
	<ImageBackground
	  source={require('../../assets/images/bg/comet.png')}
	  className="flex-1 justify-center items-center"
	  resizeMode="stretch"
	>
	  <Text className="text-custom-white text-2xl">Rest</Text>
	</ImageBackground>
      ) : (
	routinesArray.map((routine, index) => (
	  <TimeSlot key={`timeslot-${index}`} routine={routine} />
	))
      )}
    </View>
  )
}

export default TimeSlotList

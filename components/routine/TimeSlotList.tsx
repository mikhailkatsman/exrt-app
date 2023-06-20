import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"

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

  return routinesArray.length === 0 ? (
      <Text className="text-custom-white">REST DAY</Text>
    ) : (
      routinesArray.map(routine => (
        <Text className="text-custom-white">{routine.time} - {routine.id}</Text>
      ))
    )
}

export default TimeSlotList

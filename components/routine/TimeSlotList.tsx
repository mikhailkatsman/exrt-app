import { useEffect, useState } from "react"
import { View } from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"
import TimeSlot from "./TimeSlot"

type Props = {
  dataArray: any[],
  selectedDay: number,
}

const TimeSlotList: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const [sessionsArray, setSessionsArray] = useState<any[]>([])
  const timeSignatureArray: string[] = []

  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, '0')
    timeSignatureArray.push(`${formattedHour}:00`)
  }

  useEffect(() => {
    const daySessions: any[] = dataArray
      .filter(item => item.day_id === selectedDay + 1)
      .map(item => {
	const sessions = item.session_ids.split(',')
	const times = item.session_times.split(',')

	return sessions.map((sessionId: string, index: number) => ({
	  id: sessionId,
	  time: times[index]
	}))
      })
      .flat()

    setSessionsArray(daySessions)
  }, [dataArray, selectedDay])

  return (
    <View className="p-2 h-[90%] flex-col justify-between">
      {timeSignatureArray.map((timeSignarure, index) => (
	<TimeSlot
	  key={index}
	  timeSignature={timeSignarure}
	  sessionsArray={sessionsArray}
	/>
      ))}
    </View>
  )
}

export default TimeSlotList

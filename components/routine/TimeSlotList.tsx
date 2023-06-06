import { useEffect, useState } from "react"
import { View } from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"

type Props = {
  dataArray: any[],
  selectedDay: number,
}

type TimeSlot = {
  key: string,
  timeSignature: string,
  sessionId: string | null,
}

const TimeSlotList: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const timeSignatureArray: string[] = []
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, '0')
    timeSignatureArray.push(`${formattedHour}:00`)
  }

  useEffect(() => {
    const filteredData = dataArray.filter(data => data.day_id === selectedDay + 1)
    console.log(filteredData)
    const updatedTimeSlots: TimeSlot[] = timeSignatureArray.map((timeSignature, index) => {
      const matchingData = filteredData.find(data => data.session_times === timeSignature)
      const sessionId: string | null = matchingData ? matchingData.session_ids : null

      return {
        key: `slot-${index}`,
        timeSignature,
        sessionId,
      }
    })

    setTimeSlots(updatedTimeSlots)

    console.log(updatedTimeSlots)

  }, [dataArray, selectedDay])

  return (
    <View className="p-2 h-[90%] flex-col justify-between">
    </View>
  )
}

export default TimeSlotList

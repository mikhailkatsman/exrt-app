import { useEffect, useState } from "react"
import { View, Text, ScrollView } from "react-native"
import TimeSlot from "./TimeSlot"

type Props = {
  dataArray: any[]
  selectedDay: number 
}

const Routine: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const [sessionsArray, setSessionsArray] = useState<any[]>([])
  const timeSignatureArray: string[] = []

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      timeSignatureArray.push(`${formattedHour}:${formattedMinute}`)
    }
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
    <View className="h-2/3 py-1 my-1">
      <View className="w-full h-full border overflow-hidden rounded-xl border-custom-white">
	<View className="bg-custom-white w-full p-2 h-[10%]">
	  <Text className="text-custom-dark text-xs">20/09/2023</Text>
	</View>
	<ScrollView className="p-2">
	  {timeSignatureArray.map(timeSignarure => (
            <TimeSlot
	      timeSignature={timeSignarure}
	      sessionsArray={sessionsArray}
	    />
	  ))}
	</ScrollView>
      </View>
    </View>
  )
}

export default Routine

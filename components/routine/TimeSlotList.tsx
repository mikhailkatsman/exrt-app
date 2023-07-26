import { useEffect, useState } from "react"
import { View, Text, ImageBackground } from "react-native"
import TimeSlot from "./TimeSlot"

type Props = {
  dataArray: any[],
  selectedDay: number,
}

const TimeSlotList: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const [sessionsArray, setSessionsArray] = useState<any[]>([])

  useEffect(() => {
    const filteredData: any[] = dataArray
      .filter(data => data.day_id === selectedDay + 1)
      .map(item => {
	const sessions = item.session_ids.split(',')
	const times = item.session_times.split(',')
	return sessions.map((sessionId: string, index: number) => ({
	  id: parseInt(sessionId),
	  time: times[index]
	}))
      })
      .flat()

    setSessionsArray(filteredData)

  }, [dataArray, selectedDay])

  return (
    <View className="w-full h-[92%] rounded-xl bg-custom-dark px-2 pt-2"> 
      {sessionsArray.length === 0 ? (
	<ImageBackground
	  source={require('../../assets/images/bg/comet.png')}
	  className="flex-1 justify-center items-center"
	  resizeMode="stretch"
	>
	  <Text className="text-custom-white text-2xl">Rest</Text>
	</ImageBackground>
      ) : (
	sessionsArray.map((session, index) => (
	  <TimeSlot key={`timeslot-${index}`} session={session} routineId={selectedDay + 1} />
	))
      )}
    </View>
  )
}

export default TimeSlotList

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
	const statuses = item.session_statuses.split(',')
	return sessions.map((sessionId: string, index: number) => ({
	  id: parseInt(sessionId),
	  status: statuses[index]
	}))
      })
      .flat()

    setSessionsArray(filteredData)
  }, [dataArray, selectedDay])

  return (
    <View className="flex-1"> 
      {sessionsArray.length === 0 ? (
	<ImageBackground
	  source={require('../../assets/images/bg/comet.png')}
	  className="flex-1 justify-center items-center"
	  resizeMode="stretch"
	>
	  <Text className="text-custom-white font-BaiJamjuree-Regular text-4xl">Rest</Text>
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

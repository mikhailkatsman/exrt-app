import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import DraggableFlatList, { RenderItemParams, OpacityDecorator } from "react-native-draggable-flatlist"

type Props = {
  dataArray: any[],
  selectedDay: number,
  timeSignatureArray: string[],
}

type TimeSlot = {
  key: string,
  timeSignature: string,
  sessionId: string | null,
}

const TimeSlotList: React.FC<Props> = ({ dataArray, selectedDay, timeSignatureArray }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

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

    const updatedTimeSlots: TimeSlot[] = timeSignatureArray.map((timeSignature, index) => {
      const matchingData = filteredData.find(data => data.time === timeSignature)
      const sessionId: string | null = matchingData ? matchingData.id : null
      return {
        key: `timeslot-${index}`,
        timeSignature,
        sessionId,
      }
    })

    setTimeSlots(updatedTimeSlots)

  }, [dataArray, selectedDay])

  // MOVE TO SEPARATE MODULE
  const timeSlotRenderer = ({item, drag, isActive}: RenderItemParams<TimeSlot>) => {
    return item.sessionId ? (
	<TouchableOpacity	    
	  className="w-full flex-row items-center"
	  style={{height: 19.8, zIndex: 9999}}
          activeOpacity={1}
	  onLongPress={drag}
	  disabled={isActive}
	>
	  <Text className="w-[13%] text-sm text-custom-blue">
	    {item.timeSignature}
	  </Text>
	  <View className="border-b-2 border-custom-blue w-[7%]" />
	  <View className="h-[320%] w-[80%] rounded-lg bg-custom-blue p-2">
	    <Text className="text-sm text-custom-white">Upcoming session:</Text>
	  </View>
	</TouchableOpacity>
    ) : (
	<TouchableOpacity 
	  className="w-full flex-row items-center"
	  style={{height: 19.8, zIndex: 0}}
          activeOpacity={1}
	  onLongPress={drag}
	  disabled={isActive}
	>
	  <Text className="w-[12%] text-xs text-custom-grey">
	    {item.timeSignature}
	  </Text>
	  <View className="border-b border-custom-grey w-[88%]" />
	</TouchableOpacity>
    )
  }

  return (
    <DraggableFlatList
      className="p-2"
      data={timeSlots}  
      onDragEnd={({ data }) => setTimeSlots(data)}
      keyExtractor={(item) => item.key}
      renderItem={timeSlotRenderer}
      dragItemOverflow={true}
    />
  )
}

export default TimeSlotList

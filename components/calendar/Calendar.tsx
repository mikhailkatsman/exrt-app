import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import SelectedDay from "./SelectedDay"
import DaySessionIndicator from "@components/calendar/DaySessionIndicator"
import Animated, { Easing, withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

type Props = {
  isFirstTime: boolean | undefined,
  dataArray: any[],
  dayNow: number,
  setSelectedDay: (dayIndex: number ) => void,
  screenWidth: number,
}

const Calendar: React.FC<Props> = ({
  isFirstTime,
  dataArray,
  dayNow,
  setSelectedDay,
  screenWidth
}) => {
  const week: string[] = ["M", "T", "W", "T", "F", "S", "S"]
  const [activeWeekDays, setActiveWeekDays] = useState<any[]>([])

  const selectedDayAnim = useSharedValue(isFirstTime ? 6 : dayNow)
  const selectedDayStyle = useAnimatedStyle(() => {
    const x = selectedDayAnim.value * ((screenWidth - 16) / 7)

    return { transform: [{ translateX: x }] }
  })

  const handleDayPress = (dayIndex: number) => {
    selectedDayAnim.value = withTiming(dayIndex, { duration: 250, easing: Easing.out(Easing.exp) })
    setSelectedDay(dayIndex)
  }

  useEffect(() => {
    const filteredData: any[] = dataArray
      .map(item => {
	return {
	  dayId: item.day_id,
	  statuses: item.session_statuses.split(',')
	}
      })

    setActiveWeekDays(filteredData)
  }, [dataArray])

  return (
    <View className="flex-row w-full h-20 justify-between py-1 mt-1 mb-5">
      <Animated.View style={selectedDayStyle}>
	<SelectedDay width={(screenWidth - 16) / 7} />
      </Animated.View>
      {week.map((day, index) => (
	<TouchableOpacity 
	  className="h-full flex-col flex-1 items-stretch" 
	  key={index}
	  activeOpacity={1}
	  onPress={() => handleDayPress(index)}
	>
	  <View className="h-1/3 flex justify-center items-center">
	    <Text className={`font-BaiJamjuree-Bold
              ${index === dayNow ?
                'text-custom-red' 
	      : activeWeekDays.some((item: any) => item.dayId === index + 1) ? 
		'text-custom-white'
	      : 'text-custom-grey'
	      }`}
	    >
	      {day}
	    </Text>
	  </View>
	  {activeWeekDays && activeWeekDays.some(item => item.dayId === index + 1) && 
	    <DaySessionIndicator 
	      statuses={activeWeekDays.find(item => item.dayId === index + 1).statuses}
	    />
	  } 
	</TouchableOpacity>
      ))}
    </View>
  )
}

export default Calendar

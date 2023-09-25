import React, { useEffect, useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import SelectedDay from "./SelectedDay"
import DaySessionIndicator from "@components/calendar/DaySessionIndicator"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

type Props = {
  dataArray: any[]
  dayNow: number
  selectedDay: number 
  setSelectedDay: (dayIndex: number ) => void
}

const indicatorWidth = (Dimensions.get('screen').width - 16) / 7

const Calendar: React.FC<Props> = ({
  dataArray,
  dayNow,
  selectedDay,
  setSelectedDay
}) => {
  const week: string[] = ["M", "T", "W", "T", "F", "S", "S"]
  const [activeWeekDays, setActiveWeekDays] = useState<any[]>([])

  const selectedDayAnim = useSharedValue(selectedDay)

  const selectedDayStyle = useAnimatedStyle(() => {
    const x = selectedDayAnim.value * indicatorWidth

    return { transform: [{ translateX: x }] }
  })

  const handleDayPress = (dayIndex: number) => {
    selectedDayAnim.value = withSpring(dayIndex, {
      damping: 6.7,
      mass: 0.2,
    })
    setSelectedDay(dayIndex)
  }

  useEffect(() => {
    setActiveWeekDays(dataArray.map(item => item.day_id))
  }, [dataArray])

  return (
    <View className="flex-row w-full h-20 justify-between py-1 my-1">
      <Animated.View style={selectedDayStyle}>
	<SelectedDay width={indicatorWidth} />
      </Animated.View>
      {week.map((day, index) => (
	<TouchableOpacity 
	  className="h-full flex-col flex-1 items-stretch" 
	  key={index}
	  activeOpacity={1}
	  onPress={() => handleDayPress(index)}
	>
	  <View className="h-1/3 flex justify-center items-center">
	    <Text className={`
	      ${index === selectedDay ? 'font-BaiJamjuree-Bold text-lg' : 'text-xs font-BaiJamjuree-Light'} 
              ${index === dayNow ? 'text-custom-red' : 'text-custom-white'}
	      `}
	    >
	      {day}
	    </Text>
	  </View>
	  {activeWeekDays && activeWeekDays.some(item => item === index + 1) && 
	    <DaySessionIndicator />
	  } 
	</TouchableOpacity>
      ))}
    </View>
  )
}

export default Calendar

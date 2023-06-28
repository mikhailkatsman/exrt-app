import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import SelectedDay from "./SelectedDay"
import Hatch from "../../assets/Hatch"
import DaySessionIndicator from "./DaySessionIndicator"

type Props = {
  dataArray: any[]
  dayNow: number
  selectedDay: number 
  setSelectedDay: (dayIndex: number ) => void
}

const Calendar: React.FC<Props> = ({
  dataArray,
  dayNow,
  selectedDay,
  setSelectedDay
}) => {
  const week: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const [activeWeekDays, setActiveWeekDays] = useState<any[]>([])

  const handleDayPress = (dayIndex: number) => setSelectedDay(dayIndex)

  useEffect(() => {
    setActiveWeekDays(dataArray.map(item => item.day_id))
  }, [dataArray])

  return (
    <View className="flex-row w-full h-[10%] justify-between py-1 my-1">
      {week.map((day, index) => (
	<TouchableOpacity 
	  className="h-full flex-col flex-1 items-stretch" 
	  key={index}
	  activeOpacity={1}
	  onPress={() => handleDayPress(index)}
	>
	  <Text className={`
            h-1/3 text-center text-custom-white
            ${index === dayNow ? 'font-extrabold' : 'text-xs'} 
	    `}
	  >
	    {day[0]}
	  </Text>
	  <View
	    className={`
              overflow-hidden
              relative
              h-2/3
              border-custom-white
              border-y
              ${index === dayNow && 'border-x'}
              ${index === 0 && 'border-l rounded-l-xl'}
	      ${index === week.length - 1 && 'border-r rounded-r-xl'} 
	    `}
	  >
	    {index === dayNow && <Hatch />}
	  </View>
	  {selectedDay === index && <SelectedDay />}
	  {activeWeekDays && activeWeekDays.some(item => item === index + 1) && 
	    <DaySessionIndicator />
	  } 
	</TouchableOpacity>
      ))}
    </View>
  )
}

export default Calendar

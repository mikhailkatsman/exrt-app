import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import SelectedDay from "./SelectedDay"
import Hatch from "../../assets/Hatch"
import DaySessionIndicator from "./DaySessionIndicator"
import db from '../../modules/DB'

const Calendar: React.FC = () => {
  const week: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayNow: number = (new Date().getDay() + 6) % 7 

  const [selectedDay, setSelectedDay] = useState(week[dayNow])
  const [activeWeekDays, setActiveWeekDays] = useState<any[]>([])
  const handleDayPress = (day: string) => setSelectedDay(day)

  useEffect(() => {
    db.sql(
      'SELECT day_id FROM weekly_session_instances', [],
      (_, result) => setActiveWeekDays(result.rows._array)
    ) 
  }, [])

  return (
    <View className="flex-row w-full h-[10%] justify-between py-1 my-1">
      {week.map((day, index) => (
	<TouchableOpacity 
	  className="h-full flex-col flex-1 items-stretch" 
	  key={index}
	  activeOpacity={1}
	  onPress={() => handleDayPress(day)}
	>
	  <Text className="h-1/3 text-center text-custom-white text-xs">{day[0]}</Text>
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
	  {selectedDay === day && <SelectedDay />}
	  {activeWeekDays && activeWeekDays.some(item => item.day_id === index + 1) && 
	    <DaySessionIndicator />
	  } 
	</TouchableOpacity>
      ))}
    </View>
  )
}

export default Calendar

import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Container from "../common/Container"

const Calendar: React.FC = () => {
  const week: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dateNow: Date = new Date()
  const dayNow: number = dateNow.getDay() 

  return (
    <View className="flex-row w-full h-[10%] justify-between p-1">
      {week.map((day, index) => (
	<TouchableOpacity className="h-full flex-col flex-1 items-stretch" key={index}>
	  <Text className="h-1/3 text-center text-white text-xs">{day[0]}</Text>
	  <View 
	    className={`
              h-2/3
              border-slate-700
              border-y
              ${index === 0 ? 'border-l rounded-l' : ''}
	      ${index === (week.length - 1) ? 'border-r rounded-r': ''} 
              ${index === dayNow ? 'bg-slate-700' : ''}
	    `}
	  >
	  </View>
	</TouchableOpacity>
      ))}
    </View>
  )
}

export default Calendar

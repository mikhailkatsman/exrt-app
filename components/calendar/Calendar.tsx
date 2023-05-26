import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

type Props = {
  date: Date,
}

const Calendar: React.FC<Props> = ({ date }) => {
  const week: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayNow: number = date.getDay() 

  return (
    <View className="flex-row w-full h-[10%] justify-between py-1 my-1">
      {week.map((day, index) => (
	<TouchableOpacity className="h-full flex-col flex-1 items-stretch" key={index}>
	  <Text className="h-1/3 text-center text-custom-white text-xs">{day[0]}</Text>
	  <View
	    className={`
              h-2/3
              border-custom-white
              border-y
              ${index === 0 ? 'border-l rounded-l-xl' : ''}
	      ${index === week.length - 1 ? 'border-r rounded-r-xl': ''} 
	    `}
	  >
	    {index + 1 === dayNow ? (
	      <LinearGradient
		start={{x: 0, y: 0}}
		end={{x: 1, y: 0}}
		locations={[0.2, 0.5, 0.8]}
		colors={['#D5F2E300', '#D5F2E3', '#D5F2E300']}
		className='h-full w-full'
	      >
		
	      </LinearGradient>
	    ): null}
	  </View>
	</TouchableOpacity>
      ))}
    </View>
  )
}

export default Calendar

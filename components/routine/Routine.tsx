import { useEffect, useState } from "react"
import { Dimensions } from "react-native"
import TimeSlotList from "./TimeSlotList"
import Animated, { Easing, withSequence, useAnimatedStyle, useSharedValue, withTiming, withDelay } from "react-native-reanimated"

type Props = {
  dataArray: any[],
  selectedDay: number, 
}

const screenWidth = Dimensions.get('screen').width

const Routine: React.FC<Props> = ({ dataArray, selectedDay }) => {
  const [intState, setIntState] = useState(selectedDay)

  const opacity = useSharedValue(0)
  const translateX = useSharedValue(screenWidth)

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0, { duration: 150, easing: Easing.out(Easing.ease) }),
    )

    const timeoutId = setTimeout(() => {
      translateX.value = selectedDay > intState ? screenWidth : - screenWidth

      setIntState(selectedDay)

      opacity.value = withSequence(
        withDelay(50, withTiming(1, { duration: 150, easing: Easing.in(Easing.ease) }))
      )

      translateX.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.exp) })
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [selectedDay])

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value, transform: [{ translateX: translateX.value }] }
  })

  return (
    <Animated.View style={animatedStyle} className="flex-1 flex-col p-2">
      <TimeSlotList 
        dataArray={dataArray} 
        selectedDay={intState} 
      />
    </Animated.View>
  )
}

export default Routine

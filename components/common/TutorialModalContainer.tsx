import { ReactNode } from "react"
import { View } from "react-native"
import Animated, {
	useAnimatedStyle, 
	useSharedValue, 
	withTiming 
} from "react-native-reanimated"

type Props = { 
  active: boolean,
  children: ReactNode
}

const TutorialModalContainer: React.FC<Props> = ({ active, children }) => {
  const modalOpacity = useSharedValue(0)

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
      pointerEvents: modalOpacity.value === 0 ? "none" : "auto",
    }
  })

  if (active) {
    modalOpacity.value = withTiming(1, { duration: 300 })
  } else {
    modalOpacity.value = withTiming(0, { duration: 300 })
  }

  return (
    <Animated.View 
      style={animatedModalStyle}
      className="absolute w-full h-full bg-custom-dark/60 items-center z-50"
    >
      <View className="mt-[50%] w-2/3 h-1/4 bg-custom-white flex-col justify-between rounded-2xl">
        { children }
      </View>
    </Animated.View>
  )
}

export default TutorialModalContainer

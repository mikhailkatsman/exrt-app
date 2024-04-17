import { ReactNode } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import Animated, {
	useAnimatedStyle, 
	useSharedValue, 
	withTiming 
} from "react-native-reanimated"

type TextSegment = {
  text?: string,
  bold?: boolean,
  italic?: boolean,
  color?: string,
  icon?: ReactNode,
}

type Props = { 
  active: boolean,
  text: TextSegment[],
  setTutorialModalActive: (value: boolean) => void,
  setIsFirstTime: (value: boolean) => void
}

const TutorialModalContainer: React.FC<Props> = ({ active, text, setTutorialModalActive, setIsFirstTime }) => {
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
      className="absolute w-full h-full bg-custom-dark/60 items-center z-50 flex-col justify-center"
    >
      <View className="w-4/5 h-fit bg-custom-white flex-col justify-between rounded-2xl">
        <Text className='my-3 mx-6'>
          {text.map((segment, index) => (
            <Text
              key={index}
              className={`
                font-BaiJamjuree-${segment.bold ? 'Bold' : 'Regular'}${segment.italic ? 'Italic ' : ' '}
                text-custom-${segment.color || 'dark'}
              `}
            >
              {segment.text}
              {segment.icon}
            </Text>
          ))}
        </Text>
        <View className="flex-row justify-end">
          <TouchableOpacity
            className="px-7 py-3 justify-center"
            onPress={() => {
              setTutorialModalActive(false)
              setIsFirstTime(true)
            }}
            activeOpacity={0.6}
          >
            <Text className="text-custom-dark font-BaiJamjuree-Bold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

export default TutorialModalContainer

import { View, TouchableOpacity, Text } from "react-native"
import Animated, {
	useAnimatedStyle, 
	useSharedValue, 
	withTiming 
} from "react-native-reanimated"

type Props = { 
  active: boolean,
  endTutorial: () => void,
}

type TextSegment = {
  text?: string,
  bold?: boolean,
  italic?: boolean,
  color?: string,
}

const TutorialEndSessionModalContainer: React.FC<Props> = ({
  active, 
  endTutorial,
}) => {
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

  const text: TextSegment[] = [
  { text: 'Thank you for completing\nthe tutorial!\n\n' },
  { text: 'If you want to view it again, you can find this and all the other tutorials in the\n' },
  { text: 'Settings screen', bold: true },
  { text: '.' },
  ]

  return (
  <Animated.View 
    style={animatedModalStyle}
    className="absolute w-full h-full bg-custom-dark/60 items-center z-50 flex-col justify-center"
  >
    <View className="w-3/4 h-fit bg-custom-white flex-col justify-between rounded-2xl">
	<View className="h-fit px-6 flex justify-between items-center">
      <Text className='my-3'>
      {text.map((segment, index) => (
        <Text
        key={index}
        className={`
          font-BaiJamjuree-${segment.bold ? 'Bold' : 'Regular'}${segment.italic ? 'Italic ' : ' '}
          text-custom-${segment.color || 'dark'}
        `}
        >
        {segment.text}
        </Text>
      ))}
      </Text>
    </View>
    <View className="flex-row justify-end">
      <TouchableOpacity
      className="pl-3 pr-7 py-3 justify-center"
      onPress={endTutorial}
      activeOpacity={0.6}
      >
      <Text className="text-custom-dark font-BaiJamjuree-Bold">Complete Tutorial</Text>
      </TouchableOpacity>
    </View>
    </View>
  </Animated.View>
  )
}

export default TutorialEndSessionModalContainer

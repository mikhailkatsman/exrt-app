import { View, TouchableOpacity, Text } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

type Props = { 
  active: boolean,
  setTutorialActiveSessionModalActive: (value: boolean) => void,
  finishSession: () => void,
}

type TextSegment = {
  text?: string,
  bold?: boolean,
  italic?: boolean,
  color?: string,
}

const TutorialActiveSessionModalContainer: React.FC<Props> = ({
  active, 
  setTutorialActiveSessionModalActive,
  finishSession
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
  { text: 'You can continue this ' },
  { text: 'Exercise Session', bold: true },
  { text: ' to see how everything works in practice.\n\n' },
  { text: 'Or you can skip if you want to navigate straight to the ' },
  { text: 'Completion Screen', bold: true },
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
      className="pl-7 pr-3 py-3 justify-center"
      onPress={finishSession}
      activeOpacity={0.6}
      >
      <Text className="text-custom-light-grey font-BaiJamjuree-Bold">Skip</Text>
      </TouchableOpacity>
      <TouchableOpacity
      className="pl-3 pr-7 py-3 justify-center"
      onPress={() => setTutorialActiveSessionModalActive(false)}
      activeOpacity={0.6}
      >
      <Text className="text-custom-dark font-BaiJamjuree-Bold">Continue</Text>
      </TouchableOpacity>
    </View>
    </View>
  </Animated.View>
  )
}

export default TutorialActiveSessionModalContainer

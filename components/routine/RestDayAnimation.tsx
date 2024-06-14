
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Sun from '@images/animation/sun.svg';
import Moon from '@images/animation/moon.svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';

const RestDayAnimation: React.FC = () => {
  const rotateValue = useSharedValue(0)
  const sunOpacity = useSharedValue(0)
  const moonOpacity = useSharedValue(0)

  useEffect(() => {
  rotateValue.value = withRepeat(withSequence(
    withTiming(180, { duration: 2000, easing: Easing.bezier(0, 0.8, 1, 0.2) }),
    withTiming(360, { duration: 2000, easing: Easing.bezier(0, 0.8, 1, 0.2) })
  ), -1, false)

  moonOpacity.value = withRepeat(withSequence(
    withTiming(1, {duration: 300}),
    withDelay(1400, withTiming(0, {duration: 300})),
    withTiming(0, {duration: 2000})
  ), -1, false)

  sunOpacity.value = withRepeat(withSequence(
    withDelay(2000, withTiming(1, {duration: 300})),
    withDelay(1400, withTiming(0, {duration: 300}))
  ), -1, false)
  }, [])

  const animatedRotationStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${rotateValue.value}deg` }],
  }))

  const animatedSunStyle = useAnimatedStyle(() => ({
  opacity: sunOpacity.value,
  }))

  const animatedMoonStyle = useAnimatedStyle(() => ({
  opacity: moonOpacity.value,
  }))

  return (
  <View className="flex-1 flex justify-center items-center">
    <View
    className="absolute top-1/2 
      w-[230px] z-50 border-t-custom-dark-grey border-t-2
      flex justify-start items-center"
    >
    <Text className="mt-4 font-BaiJamjuree-Regular text-custom-white text-3xl">
      REST DAY
    </Text>
    </View>
    <Animated.View style={animatedRotationStyle} className="w-[210px] h-[210px]">
    <Animated.View style={animatedSunStyle} className="w-full h-full absolute">
      <Sun
      className="absolute top-1/2 right-0 -translate-y-[35px]"
      width={70} 
      height={70}
      />
    </Animated.View>
    <Animated.View style={animatedMoonStyle} className="w-full h-full absolute">
      <Moon 
      className="absolute top-1/2 left-0 -translate-y-[35px]"
      width={70} 
      height={70}
      />
    </Animated.View>
    </Animated.View>
  </View>
  )
}

export default RestDayAnimation

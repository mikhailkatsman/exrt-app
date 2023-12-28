import { Video, ResizeMode } from 'expo-av'
import { View, TouchableOpacity } from "react-native"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { videoFiles } from "@modules/AssetPaths"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useEffect } from 'react'

type Props = NativeStackScreenProps<RootStackParamList, 'FullScreenVideo'>

const FullScreenVideoScreen: React.FC<Props> = ({ route, navigation }) => {
  const videoSource = route.params.videoSource

  const opacity = useSharedValue(0)

  const videoStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value }
  })

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 })
  }, [])

  return (
    <View className='bg-custom-dark flex-1'>
      <Animated.View className='flex-1' style={videoStyle}>
        <Video 
          className="h-full w-full"
          source={videoFiles[videoSource as keyof typeof videoFiles]}
          resizeMode={"cover" as ResizeMode}
          isMuted={true}
          shouldPlay={true}
          isLooping={true}
        />
        <TouchableOpacity
          className='absolute top-3 right-3'
          onPress={() => navigation.pop()}
        >
          <Icon name="close" size={40} color="#F5F6F3" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default FullScreenVideoScreen

import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Icon } from "@react-native-material/core"
import SplashScreen from "@components/context/SplashScreen"

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  return (
    <>
      <SplashScreen isComponentLoaded={isLoaded} />
      <ScreenWrapper>
        <View className="flex-1 flex justify-center items-center" onLayout={() => setIsLoaded(true)}>
          <Text className="text-custom-white font-BaiJamjuree-Bold text-4xl mb-10">
            WELCOME!
          </Text>
          <Text className="w-3/4 text-custom-white font-BaiJamjuree-Bold text-2xl mb-28">
            Thank you for using EXRT!
          </Text>
          <Text className="w-3/4 text-custom-white font-BaiJamjuree-Regular text-lg">
            Would you like to take a quick tutorial to learn the basics?
          </Text>
        </View>
        <BottomBarWrapper>
          <TouchableOpacity 
            className="px-3 flex-1 rounded-2xl border-2 border-custom-light-grey flex-row justify-between items-center"
            onPress={() => {
              navigation.replace('Home', { isFirstTime: false })
            }}
            activeOpacity={0.6}
          >
            <Text className="w-[70%] text-custom-light-grey font-BaiJamjuree-Bold capitalize">
              Skip
            </Text>
            <Icon name="debug-step-over" size={28} color="#A0A0A0" />
          </TouchableOpacity>
          <View className="w-3" />
          <TouchableOpacity 
            className="px-3 flex-1 rounded-2xl border-2 border-custom-green flex-row justify-between items-center"
            onPress={() => {
              navigation.replace('Home', { isFirstTime: true })
            }}
            activeOpacity={0.6}
          >
            <Text className="w-[70%] text-custom-green font-BaiJamjuree-Bold capitalize">
              Start Tutorial
            </Text>
            <Icon name="chevron-right" size={28} color="#74AC5D" />
          </TouchableOpacity>
        </BottomBarWrapper>
      </ScreenWrapper>
    </>
  )
}

export default WelcomeScreen

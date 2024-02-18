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
          <Text className="text-custom-white text-4xl">
            WELCOME!
          </Text>
        </View>
        <BottomBarWrapper>
          <TouchableOpacity 
            className="px-3 flex-1 rounded-xl border-2 border-custom-white flex-row justify-between items-center"
            onPress={() => {
              navigation.replace('Home', { isFirstTime: true })
            }}
            activeOpacity={0.6}
          >
            <Text className="w-[70%] text-custom-white font-BaiJamjuree-Bold capitalize">
              To Home Screen
            </Text>
            <Icon name="arrow-right" size={28} color="#F5F6F3" />
          </TouchableOpacity>
        </BottomBarWrapper>
      </ScreenWrapper>
    </>
  )
}

export default WelcomeScreen

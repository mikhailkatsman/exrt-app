import { Dimensions, Text, View } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import CurrentRest from "@components/activeSession/CurrentRest"
import ScreenWrapper from "@components/common/ScreenWrapper"

const screenWidth = Dimensions.get('screen').width

type Props = NativeStackScreenProps<RootStackParamList, 'GetReady'>

const GetReadyScreen: React.FC<Props> = ({ navigation, route }) => {
  const sessionId = route.params.sessionId
  const sessionName = route.params.sessionName

  return (
    <ScreenWrapper>
      <View className="w-full h-1/5 items-center justify-end">
        <Text className="text-custom-white text-4xl font-BaiJamjuree-Bold">Get Ready!</Text>
      </View>
      <CurrentRest 
        duration={10} 
        endRest={() => navigation.replace('ActiveSession', { sessionId: sessionId, sessionName: sessionName })}
        screenWidth={screenWidth}
      />
    </ScreenWrapper>
  )
}

export default GetReadyScreen

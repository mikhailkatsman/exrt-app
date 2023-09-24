import { Text, View } from "react-native"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { type NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect } from "react"

type Props = NativeStackScreenProps<RootStackParamList, 'EditPhase'>

const EditPhaseScreen: React.FC<Props> = ({ navigation, route }) => {
  useEffect(() => {

  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <Text className="text-custom-white text-lg font-BaiJamjuree-Medium mb-5">
          Session Breakdown:
        </Text>

      </View>
      <BottomBarWrapper>

      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditPhaseScreen

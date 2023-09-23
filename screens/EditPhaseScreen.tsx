import { View } from "react-native"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { type NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'

type Props = NativeStackScreenProps<RootStackParamList, 'PhaseDetails'>

const EditPhaseScreen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">

      </View>
      <BottomBarWrapper>

      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditPhaseScreen

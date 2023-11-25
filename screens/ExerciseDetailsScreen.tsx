import { View, Text, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import ScreenWrapper from "@components/common/ScreenWrapper"

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetails'>

const ExerciseDetailsScreen: React.FC<Props> = ({ exerciseId }) => {
  
  return (
    <ScreenWrapper>
      <Text className="text-custom-white">Details</Text>
    </ScreenWrapper>
  )
}

export default ExerciseDetailsScreen

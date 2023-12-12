import { View, Text, ScrollView, ImageBackground } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import ScreenWrapper from "@components/common/ScreenWrapper"
import { muscleGroups } from "@modules/AssetPaths"

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetails'>

const ExerciseDetailsScreen: React.FC<Props> = ({ exerciseId }) => {
  
  return (
    <ScreenWrapper>
      <Text className="text-custom-white">Details</Text>
      <ImageBackground
        className="h-full"
        resizeMode="contain"
        source={muscleGroups['base' as keyof typeof muscleGroups]}
      >

      </ImageBackground>
    </ScreenWrapper>
  )
}

export default ExerciseDetailsScreen

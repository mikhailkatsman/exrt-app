import { View, Text, Button, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from '@modules/DB'
import ScreenWrapper from "@components/common/ScreenWrapper"

type Props = NativeStackScreenProps<RootStackParamList, 'ExercisesList'>

const ExerciseListScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <Text className="text-custom-white">
        Exercise List
      </Text>
    </ScreenWrapper>
  )
}

export default ExerciseListScreen

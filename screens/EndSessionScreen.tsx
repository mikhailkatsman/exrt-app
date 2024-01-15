import { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import DB from "@modules/DB";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";

type Props = NativeStackScreenProps<RootStackParamList, 'EndSession'>

const EndSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId
  const timeTotal: number = route.params.timeTotal
  const exerciseInstances: any[] = route.params.exerciseInstances

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = (totalSeconds % 60).toString()
    return `${hours > 0 ? hours.toString() + 'hr ' : ''}${minutes > 0 ? minutes.toString() + 'min ' : ''}${seconds}sec`
  }

  return (
    <ScreenWrapper>
      <Text className="text-custom-white">{sessionId}</Text>
      {exerciseInstances.map((instance, index) => (
        <Text key={index} className="text-custom-white">{JSON.stringify(instance, null, 2)}</Text>
      ))}
      <Text className="text-custom-white">FINISHED IN: {formatTime(timeTotal)}</Text>
      <BottomBarWrapper>

      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EndSessionScreen

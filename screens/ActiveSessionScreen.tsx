import { ComponentType, useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useKeepAwake } from "expo-keep-awake";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: ComponentType<Props> = ({ navigation, route }) => {
  useKeepAwake()

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <Text className="text-custom-white">Session id: {route.params.sessionId}</Text>
      </View>
      <BottomBarWrapper>
        <TouchableOpacity className="
          flex-1 flex-row items-center justify-center 
          rounded-xl bg-custom-blue"
        >
          <Text className="text-xs mr-2 text-custom-white font-BaiJamjuree-Bold">Start Session</Text>
          <Icon name="timer-outline" color="#F5F6F3" size={24} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default ActiveSessionScreen

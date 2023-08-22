import { useState } from "react"
import { View, TouchableOpacity, Text, TextInput, ImageBackground } from 'react-native'
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"

type Props = NativeStackScreenProps<RootStackParamList, 'EditProgram'>

const EditProgramScreen: React.FC<Props> = ({ navigation, route }) => {
  const programId: number = route.params.programId
  console.log(programId)

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
      </View>
      <BottomBarWrapper>
        <TouchableOpacity className="
          flex-1 border-2 border-custom-blue
          flex-row items-center justify-center 
          rounded-xl"
          onPress={() => {}}
        >
          <Text className="text-xs text-custom-blue mr-2 font-BaiJamjuree-Bold">Create Your Program</Text>
          <Icon name="swap-horizontal" color="#5AABD6" size={24} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditProgramScreen 

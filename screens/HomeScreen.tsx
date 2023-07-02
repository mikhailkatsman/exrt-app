import { View, Text, Button } from "react-native"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import { ComponentType } from "react"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>


const HomeScreen: ComponentType<Props> = ({ navigation }) => {
  return (
    <View className="h-full w-full bg-custom-dark flex items-center justify-center">
      <Text className="text-custom-white mb-4">Home Screen</Text>
      <Button title="Go To Hub" onPress={() => navigation.navigate('Hub')} />
    </View>
  )
}

export default HomeScreen

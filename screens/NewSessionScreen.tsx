import { View, Text } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import { ComponentType } from "react"

type Props = NativeStackScreenProps<RootStackParamList, 'NewSession'>


const NewSessionsScreen: ComponentType<Props> = ({ navigation, route }) => {
  return (
    <View className="h-full w-full bg-custom-dark flex items-center justify-center">
      <Text className="text-custom-white mb-4">New Session</Text>
      <Text className="text-custom-white mb-4">{route.params?.routineId}</Text>
    </View>
  )
}

export default NewSessionsScreen

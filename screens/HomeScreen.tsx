import { View, Text, Button } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="h-full w-full bg-custom-dark flex items-center justify-center">
      <Text className="text-custom-white mb-4">Home Screen</Text>
      <Button title="Continue Your Progress" onPress={() => navigation.navigate('Hub')} />
      <View className="h-2" />
      <Button title="Browse Programs" onPress={() => navigation.navigate('Programs')} />
      <View className="h-2" />
      <Button title="Create a New Program" onPress={() => navigation.navigate('NewProgram')} />
    </View>
  )
}

export default HomeScreen

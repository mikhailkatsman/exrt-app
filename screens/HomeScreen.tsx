import { View, Text, Button } from "react-native"
import { ComponentType } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import DropDown from "../components/common/Dropdown"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>


const HomeScreen: ComponentType<Props> = ({ navigation }) => {
  //TEMP
  const scrollData: number[] = []
  for (let i = 1; i <= 100; i++) scrollData.push(i);

  return (
    <View className="h-full w-full bg-custom-dark flex items-center justify-center">
      <Text className="text-custom-white mb-4">Home Screen</Text>
      <Button title="Go To Hub" onPress={() => navigation.navigate('Hub')} />
      <View className="h-2" />
      <DropDown 
        placeholder="Testing" 
        listItems={[]}
      />
    </View>
  )
}

export default HomeScreen

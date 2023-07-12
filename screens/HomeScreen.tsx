import { View, Text, Button } from "react-native"
import { ComponentType } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import DropDown from "../components/common/Dropdown"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>


const HomeScreen: ComponentType<Props> = ({ navigation }) => {
  return (
    <View className="h-full w-full bg-custom-dark flex items-center justify-center">
      <Text className="text-custom-white mb-4">Home Screen</Text>
      <Button title="Go To Hub" onPress={() => navigation.navigate('Hub')} />
      <View className="h-2" />
      <DropDown 
        placeholder="Testing" 
        listItems={[
          {label: 'First', value: 'first'},
          {label: 'Second', value: 'second'},
          {label: 'Third', value: 'third'},
          {label: 'Fourth', value: 'fourth'},
          {label: 'Fifth', value: 'fifth'},
          {label: 'Sixth', value: 'sixth'},
        ]}
      />
    </View>
  )
}

export default HomeScreen

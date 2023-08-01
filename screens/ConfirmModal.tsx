import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";

import { LogBox } from "react-native";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmModal'>

const ConfirmModal: React.FC<Props> = ({ navigation, route }) => {
  const text: string = route.params.text
  const onConfirm = route.params.onConfirm

  return (
    <View className="flex-1 bg-custom-dark/60 justify-center items-center">
      <View className="w-2/3 h-1/4 bg-custom-dark flex-col justify-between rounded-xl border border-custom-white">
        <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
          <Text className="text-custom-white font-BaiJamjuree-Regular">{text}</Text>
        </View>
        <View className="h-[30%] p-2 flex-row justify-between items-center">
          <TouchableOpacity 
            className="h-full w-1/2 flex justify-center items-center rounded-lg border border-custom-red" 
            onPress={() => {
              onConfirm()
              navigation.goBack()
            }}
          >
            <Text className="text-custom-red font-BaiJamjuree-Bold">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="h-full w-1/2 flex justify-center items-center" 
            onPress={() => navigation.goBack()}
          >
            <Text className="text-custom-white font-BaiJamjuree-Bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ConfirmModal

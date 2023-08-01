import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, 'ErrorModal'>

const ErrorModal: React.FC<Props> = ({ navigation, route }) => {
  const title: string = route.params.title
  const message: string = route.params.message

  return (
    <Pressable 
      className="flex-1 bg-custom-dark/60 justify-center items-center"
      onPress={() => navigation.goBack()}
    >
      <View className="w-2/3 h-1/4 bg-custom-dark flex-col justify-between rounded-xl border border-custom-white">
        <View className="h-[20%] p-2 flex justify-center items-center">
          <Text className="text-custom-white font-BaiJamjuree-Bold">{title}</Text>
        </View>
        <View className="h-[50%] pb-2 px-6 flex justify-center items-center">
          <Text className="text-custom-white font-BaiJamjuree-Regular">{message}</Text>
        </View>
        <View className="h-[30%] p-2">
          <TouchableOpacity 
            className="h-full w-full flex justify-center items-center rounded-lg border border-custom-white" 
            onPress={() => navigation.goBack()}
          >
            <Text className="text-custom-white font-BaiJamjuree-Bold">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  )
}

export default ErrorModal

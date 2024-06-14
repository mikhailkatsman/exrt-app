import ModalContainer from "@components/common/ModalContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, 'ErrorModal'>

const ErrorModal: React.FC<Props> = ({ navigation, route }) => {
  const title: string = route.params.title
  const message: string = route.params.message

  return (
  <ModalContainer>
    <View className="h-[20%] p-2 flex justify-center items-center">
    <Text className="text-custom-white font-BaiJamjuree-Bold">{title}</Text>
    </View>
    <View className="h-[50%] pb-2 px-5 flex justify-center items-center">
    <Text className="text-custom-white font-BaiJamjuree-Regular">{message}</Text>
    </View>
    <View className="h-[30%] p-2">
    <TouchableOpacity 
      className="h-full w-full flex justify-center items-center rounded-lg border border-custom-white" 
      onPress={() => navigation.pop()}
    >
      <Text className="text-custom-white font-BaiJamjuree-Bold">OK</Text>
    </TouchableOpacity>
    </View>
  </ModalContainer>
  )
}

export default ErrorModal

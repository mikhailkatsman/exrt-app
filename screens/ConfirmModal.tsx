import ModalContainer from "@components/common/ModalContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { DeviceEventEmitter } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmModal'>

const ConfirmModal: React.FC<Props> = ({ navigation, route }) => {
  const text: string = route.params.text
  const eventId: string = route.params.eventId

    return (
    <ModalContainer>
      <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
        <Text className="text-custom-white font-BaiJamjuree-Regular">{text}</Text>
      </View>
      <View className="h-[30%] p-2 flex-row justify-between items-center">
        <TouchableOpacity 
          className="h-full w-1/2 flex justify-center items-center rounded-xl border-2 border-custom-red" 
          onPress={() => {
            navigation.pop()
            DeviceEventEmitter.emit(`deleteEvent${eventId}`)
          }}
        >
          <Text className="text-custom-red font-BaiJamjuree-Bold">Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="h-full w-1/2 flex justify-center items-center" 
          onPress={() => navigation.pop()}
        >
          <Text className="text-custom-white font-BaiJamjuree-Bold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ModalContainer>
  )
}

export default ConfirmModal

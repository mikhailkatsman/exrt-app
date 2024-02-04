import ModalContainer from "@components/common/ModalContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { DeviceEventEmitter } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmModal'>

const ConfirmModal: React.FC<Props> = ({ navigation, route }) => {
  const text: string = route.params.text

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('deleteEvent')
    }
  }, [])

  return (
    <ModalContainer>
      <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
        <Text className="text-custom-white font-BaiJamjuree-Regular">{text}</Text>
      </View>
      <View className="h-[30%] p-2 flex-row justify-between items-center">
        <TouchableOpacity 
          className="h-full w-1/2 flex justify-center items-center rounded-lg border border-custom-red" 
          onPress={() => {
            DeviceEventEmitter.emit('deleteEvent')
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

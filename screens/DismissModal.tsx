import ModalContainer from "@components/common/ModalContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { DeviceEventEmitter } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, 'DismissModal'>

const DismissModal: React.FC<Props> = ({ navigation, route }) => {
  const eventId: string = route.params.eventId

  return (
    <ModalContainer>
      <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
        <Text className="text-custom-white font-BaiJamjuree-Regular">
          Are you sure you want to go back? 
        </Text>
        <Text className="text-custom-white font-BaiJamjuree-Regular">
          Any unsaved changes will be lost.
        </Text>
      </View>
      <View className="h-[30%] p-2 flex-row justify-between items-center">
        <TouchableOpacity 
          className="h-full w-1/2 flex justify-center items-center rounded-lg border border-custom-red" 
          onPress={() => {
            navigation.pop()
            DeviceEventEmitter.emit(`dismissEvent${eventId}`)
          }}
        >
          <Text className="text-custom-red font-BaiJamjuree-Bold">Go back</Text>
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

export default DismissModal

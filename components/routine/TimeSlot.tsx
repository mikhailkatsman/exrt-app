import { View, Text } from "react-native"
import { ScaleDecorator } from "react-native-draggable-flatlist"
import { TouchableOpacity } from "react-native-gesture-handler"

type Props = {
  timeSignature: string,
  sessionsArray: {id: string, time: string}[]
}

const TimeSlot: React.FC<Props> = ({ timeSignature, sessionsArray }) => {
  return sessionsArray.some(item => item.time === timeSignature) ?
  (
    <ScaleDecorator>
      <TouchableOpacity className="w-full h-[4.1666%] flex-row items-center z-50">
        <Text className="w-[13%] text-sm text-custom-blue">
          {timeSignature}
        </Text>
        <View className="border-b-2 border-custom-blue w-[7%]" />
        <View className="h-[320%] w-[80%] rounded-lg bg-custom-blue p-2">
          <Text className="text-sm text-custom-white">Upcoming session:</Text>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  ) :
  (
    <View className="w-full h-[4.1666%] flex-row items-center z-0">
      <Text className="w-[12%] text-xs text-custom-grey">
        {timeSignature}
      </Text>
      <View className="border-b border-custom-grey w-[88%]" />
    </View>
  )
}

export default TimeSlot

import { View } from "react-native"

type Props = {
  timeSignature: string,
  sessionsArray: {id: string, time: string}[]
}

const TimeSlot: React.FC<Props> = ({ timeSignature, sessionsArray }) => {
  return (
    <View className={``}>
      {timeSignature}
    </View>
  )
}

export default TimeSlot

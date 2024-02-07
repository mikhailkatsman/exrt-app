import { View } from "react-native"
import Sun from '@images/animation/sun.svg'
import Moon from '@images/animation/moon.svg'

const RestDayAnimation: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Sun width={100} height={100} scale={50} />
    </View>
  )
}

export default RestDayAnimation

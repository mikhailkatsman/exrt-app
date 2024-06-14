import { ReactNode } from "react"
import { View } from "react-native"

type Props = { children: ReactNode }

const ModalContainer: React.FC<Props> = ({ children }) => {
  return (
  <View className="flex-1 bg-custom-dark/60 items-center">
    <View className="mt-[50%] w-2/3 h-1/4 bg-custom-dark flex-col justify-between rounded-2xl border border-custom-white">
    { children }
    </View>
  </View>
  )
}

export default ModalContainer

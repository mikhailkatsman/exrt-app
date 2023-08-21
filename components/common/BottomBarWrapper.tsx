import { ReactNode } from "react"
import { View } from "react-native"

type Props = { children: ReactNode }

const BottomBarWrapper: React.FC<Props> = ({ children }) => {
  return (
    <View className="h-16 mb-2 flex-row justify-between">
      {children}
    </View>
  )
}

export default BottomBarWrapper 

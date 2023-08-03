import { ReactNode } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = { children: ReactNode }

const ScreenWrapper: React.FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets()

  return (
    <View 
      className="flex-1 px-2 bg-custom-dark" 
      style={{ paddingBottom: insets.bottom }}
    >
      {children}
    </View>
  )
}

export default ScreenWrapper

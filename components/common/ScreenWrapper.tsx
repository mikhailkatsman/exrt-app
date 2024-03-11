import { ReactNode } from "react"
import { SafeAreaView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = { 
  children: ReactNode,
}

const ScreenWrapper: React.FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView 
      className="flex-1 px-2 bg-custom-dark" 
      style={{ paddingBottom: insets.bottom }}
    >
      {children}
    </SafeAreaView>
  )
}

export default ScreenWrapper

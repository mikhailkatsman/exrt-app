import { ReactNode } from "react"
import { View } from "react-native"


type Props = {
  bg?: string,
  dir?: string,
  children: ReactNode,
}

const Container: React.FC<Props> = ({
  bg = "bg-slate-50",
  dir = "flex-row",
  children,
}) => {
  return (
    <View className={`${bg} ${dir} items-stretch p-2`}>
      {children}
    </View>
  )
}

export default Container

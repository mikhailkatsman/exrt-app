import { ComponentType } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: ComponentType<Props> = ({ navigation, route }) => {
  return (
    <></>
  )
}

export default ActiveSessionScreen

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import ModalContainer from "@components/common/ModalContainer"

type Props = NativeStackScreenProps<RootStackParamList, 'SessionResultsModal'>

const SessionResultsModal: React.FC<Props> = ({ navigation, route }) => {
  return (
    <ModalContainer>

    </ModalContainer>
  )
}

export default SessionResultsModal

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { LogBox } from "react-native";
import DB from "@modules/DB";
import ModalContainer from "@components/common/ModalContainer";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

type Props = NativeStackScreenProps<RootStackParamList, 'ChangeProgramStatusModal'>

const ChangeProgramStatusModal: React.FC<Props> = ({ navigation, route }) => {
  const programId: number = route.params.programId
  const programStatus: string = route.params.status

  const renderText = (): string => {
    if (programStatus === 'active') {
      return `Unsubscribe from this program?

All progress will be lost!`
    }

    return 'Subscribe to this program?'
  }

  const changeProgramStatus = () => {
    const newStatus = programStatus === 'active' ? 'inactive' : 'active'

    DB.transaction(tx => {
      tx.executeSql(`
        UPDATE sessions
        SET status = ?
        WHERE id IN (
          SELECT psi.session_id
          FROM phase_session_instances psi
          INNER JOIN program_phases pp ON pp.phase_id = psi.phase_id
          WHERE pp.program_id = ?
        );
      `, ['upcoming', programId])

      tx.executeSql(`
        UPDATE programs
        SET status = ?
        WHERE id = ?;
      `, [newStatus, programId]) 

      tx.executeSql(`
        UPDATE phases
        SET status = 'upcoming'
        WHERE id IN (SELECT phase_id FROM program_phases WHERE program_id = ?);
      `, [programId])
    },
    error => console.error('Error updating program status: ' + error),
    () => {
      if (newStatus === 'active') {
        DB.sql(`
          UPDATE phases
          SET status = 'active'
          WHERE id = (
            SELECT phase_id
            FROM program_phases
            WHERE program_id = ?
            ORDER BY phase_order LIMIT 1
          );
        `, [programId],
        () => navigation.pop())
      } else {
        navigation.pop()
      }
    })
  }

  const renderButton = () => {
    let colors = {
      border: 'border-custom-green',
      text: 'text-custom-green',
      title: 'Subscribe'
    }

    if (programStatus === 'active') {
      colors = {
        border: 'border-custom-red',
        text: 'text-custom-red',
        title: 'Unsubscribe'
      }
    }

    return (
      <TouchableOpacity 
        className={`h-full w-1/2 justify-center items-center rounded-xl border-2 ${colors.border}`}
        onPress={changeProgramStatus}
      >
        <Text className={`font-BaiJamjuree-Bold ${colors.text}`}>
          {colors.title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <ModalContainer>
      <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
        <Text className="text-custom-white font-BaiJamjuree-Regular">
          {renderText()}
        </Text>
      </View>
      <View className="h-[30%] p-2 flex-row justify-between items-center">
        {renderButton()}
        <TouchableOpacity 
          className="h-full w-1/2 flex justify-center items-center" 
          onPress={() => navigation.pop()}
        >
          <Text className="text-custom-white font-BaiJamjuree-Bold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ModalContainer>
  )
}

export default ChangeProgramStatusModal

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { LogBox } from "react-native";
import DB from "@modules/DB";

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

  return (
    <View className="flex-1 bg-custom-dark/60 justify-center items-center">
      <View className="w-2/3 h-1/4 bg-custom-dark flex-col justify-between rounded-xl border border-custom-white">
        <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
          <Text className="text-custom-white font-BaiJamjuree-Regular">
            {renderText()}
          </Text>
        </View>
        <View className="h-[30%] p-2 flex-row justify-between items-center">
          <TouchableOpacity 
            className={`h-full w-1/2 justify-center items-center rounded-lg border
            ${programStatus === 'active' ? 'border-custom-red' : 'border-custom-green'}`}
            onPress={changeProgramStatus}
          >
            <Text className={`font-BaiJamjuree-Bold 
              ${programStatus === 'active' ? 'text-custom-red' : 'text-custom-green'}`}
            >
              {programStatus === 'active' ? 'Unsubscribe' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="h-full w-1/2 flex justify-center items-center" 
            onPress={() => navigation.pop()}
          >
            <Text className="text-custom-white font-BaiJamjuree-Bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChangeProgramStatusModal

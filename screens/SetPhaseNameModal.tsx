import { useState } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { LogBox } from "react-native";
import DB from '@modules/DB';
import ModalContainer from '@components/common/ModalContainer';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

type Props = NativeStackScreenProps<RootStackParamList, 'SetPhaseNameModal'>

const SetPhaseNameModal: React.FC<Props> = ({ navigation, route }) => {
  const programId: number = route.params.programId

  const [name, setName] = useState<string>('New Phase')
  
  const createPhase = () => {
    DB.sql(`
      SELECT MAX(phase_order) AS maxOrder
      FROM program_phases
      WHERE program_id = ?;
    `, [programId],
    (_, result) => {
      const currentOrder = result.rows.item(0).maxOrder
      const newOrder = (currentOrder + 1) || 1
      const status = newOrder === 1 ? 'active' : 'upcoming'

      DB.sql(`
        INSERT INTO phases (name, status, custom) 
        VALUES (?, ?, ?);
      `, [name, status, 1],
      (_, result) => {
        const phaseId = result.insertId!

        DB.sql(`
          INSERT INTO program_phases (program_id, phase_id, phase_order)
          VALUES (?, ?, ?)
        `, [programId, phaseId, newOrder],
        () => navigation.replace('EditPhase', {
          phaseId: phaseId,
          phaseName: name,
          phaseCustom: 1,
          phaseStatus: status,
          newPhase: true,
        }))
      })
    })
  }

  return (
    <ModalContainer>
      <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
        <Text className='my-3 text-custom-white font-BaiJamjuree-Regular'>Program Name:</Text>
        <TextInput 
          onChangeText={setName}
          className="w-full mb-3 text-custom-white text-xl font-BaiJamjuree-Bold"
          autoCapitalize="words"
          defaultValue={name}
          selectionColor="#F5F6F3"
          autoFocus={true}
          multiline
          numberOfLines={2}
          maxLength={30}
        />
      </View>
      <View className="h-[30%] p-2 flex-row justify-between items-center">
        <TouchableOpacity 
          className="h-full w-1/2 flex justify-center items-center rounded-lg border border-custom-blue" 
          onPress={createPhase}
        >
          <Text className="text-custom-blue font-BaiJamjuree-Bold">Confirm</Text>
        </TouchableOpacity>
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

export default SetPhaseNameModal 

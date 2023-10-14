import { useState } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { LogBox } from "react-native";
import DB from '@modules/DB';

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
        INSERT INTO phases (name, status) 
        VALUES (?, ?);
      `, [name, status],
      (_, result) => {
        const phaseId = result.insertId!

        DB.sql(`
          INSERT INTO program_phases (program_id, phase_id, phase_order)
          VALUES (?, ?, ?)
        `, [programId, phaseId, newOrder],
        () => navigation.replace('EditPhase', {
          phaseId: phaseId,
          phaseName: name
        }))
      })
    })
  }

  return (
    <View className="flex-1 bg-custom-dark/60 justify-center items-center">
      <View className="w-2/3 h-52 bg-custom-dark flex-col justify-between rounded-xl border border-custom-white">
        <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
          <Text className='mb-5 text-custom-white font-BaiJamjuree-Regular'>Phase Name:</Text>
          <TextInput 
            onChangeText={setName}
            className="w-[80%] text-custom-white text-xl font-BaiJamjuree-Bold"
            autoCapitalize="words"
            defaultValue={name}
            autoFocus={true}
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
      </View>
    </View>
  )
}

export default SetPhaseNameModal 

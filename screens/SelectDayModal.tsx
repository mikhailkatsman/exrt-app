import { useState } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { LogBox } from "react-native";
import ScrollPicker from '@components/common/ScrollPicker';
import DB from '@modules/DB';
import ModalContainer from '@components/common/ModalContainer';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

type Props = NativeStackScreenProps<RootStackParamList, 'SelectDayModal'>

const SelectDayModal: React.FC<Props> = ({ navigation, route }) => {
  const phaseId: number = route.params.phaseId
  
  const [dayId, setDayId] = useState<number>(1)
  const dayNames = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
  ]

  const createSession = () => {
  const sessionName: string = 'New Session'

  DB.sql(`
    INSERT INTO sessions (name, status, custom) VALUES (?, ?, ?);
  `, [sessionName, 'upcoming', 1],
  (_, result) => {
    const sessionId = result.insertId!

    DB.sql(`
    INSERT INTO phase_session_instances (day_id, session_id, phase_id)
    VALUES (?, ?, ?);
    `, [dayId, sessionId, phaseId],
    () => {
    navigation.replace('EditSession', {
      dayId: dayId,
      sessionId: sessionId,
      sessionName: sessionName,
      sessionCustom: 1,
      newSession: true,
      phaseId: phaseId
    })
    })
  })
  }

  return (
  <ModalContainer>
    <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
    <Text className='mb-3 text-custom-white font-BaiJamjuree-Regular'>Choose the day:</Text>
    <ScrollPicker
      dataArray={dayNames}
      initialIndex={0}
      onIndexChange={(index: number) => setDayId(index + 1)}
      width={230}
    />
    </View>
    <View className="h-[30%] p-2 flex-row justify-between items-center">
    <TouchableOpacity 
      className="h-full w-1/2 flex justify-center items-center rounded-lg border border-custom-blue" 
      onPress={createSession}
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

export default SelectDayModal

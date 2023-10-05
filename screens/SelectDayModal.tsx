import { useState } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity } from "react-native";
import { LogBox } from "react-native";
import ScrollPicker from '@components/common/ScrollPicker';
import DB from '@modules/DB';

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
    DB.sql(`
      INSERT INTO sessions (status) VALUES (?)
    `, ['upcoming'],
    (_, result) => {
      const sessionId = result.insertId!

      navigation.replace('EditSession', {
        dayId: dayId,
        sessionExists: false,
        sessionId: sessionId,
        sessionName: undefined,
        phaseId: phaseId
      })
    })
  }

  return (
    <View className="flex-1 bg-custom-dark/60 justify-center items-center">
      <View className="w-2/3 h-1/3 bg-custom-dark flex-col justify-between rounded-xl border border-custom-white">
        <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
          <Text className='mb-5 text-custom-white font-BaiJamjuree-Regular'>Choose the day:</Text>
          <ScrollPicker
            dataArray={dayNames}
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
      </View>
    </View>
  )
}

export default SelectDayModal

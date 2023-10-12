import { useState, useEffect } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "App";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { LogBox } from "react-native";
import DB from '@modules/DB';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

type Props = NativeStackScreenProps<RootStackParamList, 'SetProgramNameModal'>

const SetProgramNameModal: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>('My Custom Program 1')
  
  const createProgram = () => {
    DB.sql(`
      INSERT INTO programs (name, description, thumbnail, status)
      VALUES (?, ?, ?, ?)
    `, [
      name, 
      'My custom program description.',
      'program_thumbnail_placeholder', 
      'active'
    ],
    (_, result) => {
      const programId = result.insertId 

      navigation.replace('EditProgram', { programId: programId }
    )})
  }

  useEffect(() => {
    DB.sql(`
      SELECT name
      FROM programs
      WHERE name LIKE 'My Custom Program %'
      ORDER BY CAST(SUBSTR(name, LENGTH('My Custom Program ') + 1) AS INTEGER) DESC
      LIMIT 1;
    `, [],
    (_, result) => {
      if (result.rows.length !== 0) {
        const currentName = result.rows.item(0).name
        const currentNumber = parseInt(currentName.replace('My Custom Program ', ''))
        const newName = 'My Custom Program ' + (currentNumber + 1)
        setName(newName)
      }
    })
  }, [])

  return (
    <View className="flex-1 bg-custom-dark/60 justify-center items-center">
      <View className="w-2/3 h-52 bg-custom-dark flex-col justify-between rounded-xl border border-custom-white">
        <View className="h-[70%] pb-2 px-6 flex justify-center items-center">
          <Text className='mb-5 text-custom-white font-BaiJamjuree-Regular'>Program Name:</Text>
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
            onPress={createProgram}
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

export default SetProgramNameModal 

import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { ComponentType, useEffect, useState } from "react"
import ScrollPickerGrid from "@components/actions/ScrollPickerGrid"
import ScrollPicker from 'react-native-wheel-scrollview-picker'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import DB from "@modules/DB"

type Props = NativeStackScreenProps<RootStackParamList, 'NewInstance'>

const NewInstanceScreen: ComponentType<Props> = ({ navigation }) => {
  var setRepValues: number[] = []
  var kgValues: number[] = []
  var timeValues: string[] = [] 
  const [exerciseList, setExerciseList] = useState<{ id: number, name: string, thumbnail: string }[]>([])
  
  for (let i = 0; i < 100; i++) timeValues.push(i.toString().padStart(2, '0'))
  for (let i = 1; i <= 100; i++) setRepValues.push(i)
  for (let i = 0; i <= 100;) {
    kgValues.push(i)
    if (i < 10) i += 0.25
    else if (i < 25) i += 0.5
    else i++
  }

  useEffect(() => {
    DB.sql(`
      SELECT id, name, thumbnail
      FROM exercises
      ORDER BY name
      LIMIT 20;
      `, [],
      (_, result) => {
        console.log("querying")
        setExerciseList(result.rows._array)

      }
    ) 
  }, [])

  return (
    <View className="h-full w-full p-2 bg-custom-dark">
      <ScrollPickerGrid 
        setRepValues={setRepValues}
        kgValues={kgValues}
        timeValues={timeValues}
      />
      <View
        className="
          w-full h-[63%] mb-4 flex-row overflow-hidden
          justify-between rounded-xl
          border border-custom-white
        "
      >
        <View className="w-full flex-col">
          <ScrollView 
            className="p-2 rounded-xl bg-custom-dark"
            horizontal={false}
          >
            {exerciseList.map((exercise, index) => (
              <Text key={'exercise_' + index} className="text-custom-white mb-2">{exercise.name}</Text>
            ))}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity 
        className="w-full h-[8%] bg-custom-blue rounded-xl flex justify-center items-center"
        onPress={() => navigation.pop()}
      >
      <Text className="text-custom-white font-bold text-lg">Add Instance</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NewInstanceScreen

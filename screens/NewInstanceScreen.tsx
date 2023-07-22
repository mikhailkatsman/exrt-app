import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { ComponentType, useEffect, useState } from "react"
import ScrollPickerGrid from "@components/actions/ScrollPickerGrid"
import ExerciseCard from "@components/common/ExerciseCard"
import DropDown from "@components/common/Dropdown"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import DB from "@modules/DB"

type Props = NativeStackScreenProps<RootStackParamList, 'NewInstance'>

const NewInstanceScreen: ComponentType<Props> = ({ navigation }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null)
  const [exerciseList, setExerciseList] = useState<{
    id: number, 
    name: string, 
    thumbnail: string 
  }[]>([])
  const [muscleSort, setMuscleSort] = useState<string | null>(null)
  const [typeSort, setTypeSort] = useState<string | null>(null)

  const muscleGroupList: {item: string, label: string}[] = [
    {item: 'chest', label: 'Chest'},
    {item: 'biceps', label: 'Biceps'},
    {item: 'triceps', label: 'Triceps'},
    {item: 'abs', label: 'Abs'},
    {item: 'traps', label: 'Traps'},
    {item: 'forearms', label: 'Forearms'},
    {item: 'lats', label: 'Lats'},
    {item: 'delts', label: 'Delts'},
    {item: 'glutes', label: 'Glutes'},
    {item: 'quads', label: 'Quads'},
    {item: 'calves', label: 'Calves'}
  ]
  const exerciseTypeList: {item: string, label: string}[] = [
    {item: 'bodyweight', label: 'Body Weight'},
    {item: 'equipment', label: 'Equipment'},
    {item: 'freeweight', label: 'Free Weight'}
  ]
  
  useEffect(() => {
    let sqlQuery = `
      SELECT id, name, thumbnail
      FROM exercises
      WHERE id IN (
        SELECT exercise_id
        FROM exercise_muscle_groups
        INNER JOIN muscle_groups 
        ON exercise_muscle_groups.muscle_group_id = muscle_groups.id
    `
    if (muscleSort) sqlQuery += ' WHERE muscle_groups.name = ?'
    sqlQuery += ')'
    if (typeSort) sqlQuery += ' AND type = ?'
    sqlQuery += ' ORDER BY name'

    let parameters = [muscleSort, typeSort].filter(param => param)
    
    DB.sql(
      sqlQuery,
      parameters,
      (_: any, result: any) => setExerciseList(result.rows._array)
    ) 
  }, [muscleSort, typeSort])

  return (
    <View className="h-full w-full px-2 bg-custom-dark">
      <ScrollPickerGrid />
      <View
       className="w-full h-[63%] mb-4 flex-row overflow-hidden justify-between"
      >
        <View className="w-full flex-col">
          <View className="h-[15%] p-2 flex-row items-center justify-between">
            <Text className="text-custom-white mb-1 font-bold">Sort by</Text>
            <DropDown 
              placeholder='Muscle Group'
              listItems={muscleGroupList}
              onIndexChange={(index: number) => setMuscleSort(muscleGroupList[index].item)}
              reset={() => setMuscleSort(null)}
            />
            <DropDown 
              placeholder='Type' 
              listItems={exerciseTypeList} 
              onIndexChange={(index: number) => setTypeSort(exerciseTypeList[index].item)}
              reset={() => setTypeSort(null)}
            />
          </View>
          <ScrollView 
            className="h-[85%] p-2 bg-custom-dark"
            horizontal={false}
            fadingEdgeLength={200}
          >
            {exerciseList.map((exercise, index) => (
              <ExerciseCard 
                key={index}
                id={exercise.id}
                selectedId={selectedExerciseId}
                setSelectedId={(id: number) => setSelectedExerciseId(selectedExerciseId === id ? null : id)}
                name={exercise.name}
                thumbnail={exercise.thumbnail}
              />
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

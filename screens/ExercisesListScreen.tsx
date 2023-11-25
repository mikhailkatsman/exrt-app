import { View, Text, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from '@modules/DB'
import { exerciseThumbnails } from "@modules/AssetPaths"
import ScreenWrapper from "@components/common/ScreenWrapper"
import ExerciseCard from "@components/common/ExerciseCard"
import DropDown from "@components/common/Dropdown"

type Props = NativeStackScreenProps<RootStackParamList, 'ExercisesList'>

const ExerciseListScreen: React.FC<Props> = ({ navigation }) => {
  const [exerciseList, setExerciseList] = useState<{
    id: number, 
    name: string, 
    thumbnail: keyof typeof exerciseThumbnails
  }[]>([])
  const [muscleSort, setMuscleSort] = useState<string | null>(null)
  const [typeSort, setTypeSort] = useState<string | null>(null)

  const muscleGroupList: { label: string, value: string }[] = [
    { label: 'Chest', value: 'chest' },
    { label: 'Biceps', value: 'biceps' },
    { label: 'Triceps', value: 'triceps' },
    { label: 'Abs', value: 'abs' },
    { label: 'Traps', value: 'traps' },
    { label: 'Forearms', value: 'forearms' },
    { label: 'Lats', value: 'lats' },
    { label: 'Delts', value: 'delts' },
    { label: 'Glutes', value: 'glutes' },
    { label: 'Quads', value: 'quads' },
    { label: 'Calves', value: 'calves' }
  ]
  const exerciseTypeList: { label: string, value: string }[] = [
    { label: 'Body Weight', value: 'bodyweight' },
    { label: 'Equipment', value: 'equipment' },
    { label: 'Free Weight', value: 'freeweight' }
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
    sqlQuery += ' ORDER BY name;'

    let parameters = [muscleSort, typeSort].filter(param => param)
     
    DB.sql(
      sqlQuery,
      parameters,
      (_: any, result: any) => setExerciseList(result.rows._array)
    ) 
  }, [muscleSort, typeSort])
  
  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3 flex-row overflow-hidden justify-between">
        <View className="w-full flex-col">
          <View className="h-[15%] p-2 flex-row items-center justify-between">
            <Text className="text-custom-white mb-1 font-">Sort by</Text>
            <DropDown 
              placeholder='Muscle Group'
              listItems={muscleGroupList}
              onIndexChange={(index: number) => setMuscleSort(muscleGroupList[index].value)}
              reset={() => setMuscleSort(null)}
            />
            <DropDown 
              placeholder='Type' 
              listItems={exerciseTypeList} 
              onIndexChange={(index: number) => setTypeSort(exerciseTypeList[index].value)}
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
                name={exercise.name}
                thumbnail={exercise.thumbnail}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default ExerciseListScreen

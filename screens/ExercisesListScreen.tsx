import { TextInput, View, Text, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from '@modules/DB'
import { exerciseThumbnails } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import ScreenWrapper from "@components/common/ScreenWrapper"
import ExerciseCard from "@components/common/ExerciseCard"
import DropDown from "@components/common/Dropdown"
import { useIsFocused } from "@react-navigation/native"

type Props = NativeStackScreenProps<RootStackParamList, 'ExercisesList'>

const ExerciseListScreen: React.FC<Props> = () => {
  const [exerciseList, setExerciseList] = useState<{
    id: number, 
    name: string, 
    thumbnail: keyof typeof exerciseThumbnails, 
    difficulty: number
  }[]>([])
  const [searchString, setSearchString] = useState<string | null>(null)
  const [muscleSort, setMuscleSort] = useState<string | null>(null)
  const [typeSort, setTypeSort] = useState<string | null>(null)
  const [styleSort, setStyleSort] = useState<string | null>(null)
  const [difficultySort, setDifficultySort] = useState<number | null>(null)

  const isFocused = useIsFocused()

  const muscleGroupList: { label: string, value: string }[] = [
    { label: 'Chest', value: 'middle pectoral' },
    { label: 'Biceps', value: 'biceps' },
    { label: 'Triceps', value: 'triceps' },
    { label: 'Abs', value: 'upper abs' },
    { label: 'Traps', value: 'middle trapezius' },
    { label: 'Forearms', value: 'forearms' },
    { label: 'Lats', value: 'lats' },
    { label: 'Delts', value: 'medial deltoid' },
    { label: 'Glutes', value: 'glutes' },
    { label: 'Quads', value: 'center quads' },
    { label: 'Calves', value: 'inner calves' }
  ]
  const exerciseTypeList: { label: string, value: string }[] = [
    { label: 'Body Weight', value: 'bodyweight' },
    { label: 'Equipment', value: 'equipment' },
    { label: 'Free Weight', value: 'freeweight' }
  ]

  const styleList: { label: string, value: string }[] = [
    { label: 'Compound', value: 'compound' },
    { label: 'Isolation', value: 'isolation' }
  ]

  const difficultyList: { label: string, value: number }[] = [
    { label: 'Beginner', value: 1 },
    { label: 'Intermediate', value: 2 },
    { label: 'Advanced', value: 3 },
    { label: 'Expert', value: 4 },
    { label: 'Master', value: 5 }
  ]

  const fetchExercises = (
    searchString: string | null, 
    muscleSort: string | null,
    styleSort: string | null,
    typeSort: string | null,
    difficultySort: number | null,
  ) => {
    let sqlQuery = `
      SELECT id, name, thumbnail, difficulty
      FROM exercises
      WHERE id IN (
        SELECT exercise_id
        FROM exercise_muscle_groups
        INNER JOIN muscle_groups 
        ON exercise_muscle_groups.muscle_group_id = muscle_groups.id
    `

    let parameters = []

    if (muscleSort) {
      sqlQuery += ' WHERE muscle_groups.name = ?'
      parameters.push(muscleSort)
    }

    if (searchString) {
      sqlQuery += muscleSort ? 'AND' : 'WHERE'
      sqlQuery += ' exercises.name LIKE ?'
      parameters.push(`%${searchString}%`)
    }

    sqlQuery += ')'

    if (typeSort) {
      sqlQuery += ' AND type = ?'
      parameters.push(typeSort)
    }

    if (styleSort) {
      sqlQuery += ' AND style = ?'
      parameters.push(styleSort)
    }

    if (difficultySort) {
      sqlQuery += ' AND difficulty = ?'
      parameters.push(difficultySort)
    }

    sqlQuery += ' ORDER BY name;'

    parameters = parameters.filter(param => param !== undefined || param !== null)
     
    DB.sql(
      sqlQuery,
      parameters,
      (_, result) => setExerciseList(result.rows._array)
    )
  }

  useEffect(() => {
    if (isFocused) fetchExercises(searchString, muscleSort, styleSort, typeSort, difficultySort)
  }, [isFocused, searchString, muscleSort, typeSort, styleSort, difficultySort])
  
  return (
    <ScreenWrapper>
      <View className="mx-2 h-14 mb-3 p-2 rounded-2xl border-2 border-custom-white flex justify-between flex-row items-center">
        <TextInput 
          className="px-2 flex-1 h-full text-custom-white text-lg font-BaiJamjuree-Bold"
          enterKeyHint="search"
          maxLength={25}
          selectionColor="#F5F6F3"
          onChangeText={setSearchString}
        />
        <Icon name="magnify" size={30} color="#F5F6F3" />
      </View>
      <View className="flex-1 mb-3 overflow-hidden">
        <Text className="px-2 mb-3 text-custom-grey font-BaiJamjuree-Regular">Sort by</Text>
        <View className="px-2 pb-2 flex-row justify-between">
          <DropDown 
            placeholder='Muscle Group'
            listItems={muscleGroupList}
            onIndexChange={(index: number) => setMuscleSort(muscleGroupList[index].value)}
            reset={() => setMuscleSort(null)}
          />
          <View className="w-2"/>
          <DropDown 
            placeholder='Type' 
            listItems={exerciseTypeList} 
            onIndexChange={(index: number) => setTypeSort(exerciseTypeList[index].value)}
            reset={() => setTypeSort(null)}
          />
        </View>
        <View className="mb-5 px-2 flex-row justify-between">
          <DropDown 
            placeholder='Style'
            listItems={styleList}
            onIndexChange={(index: number) => setStyleSort(styleList[index].value)}
            reset={() => setStyleSort(null)}
          />
          <View className="w-2"/>
          <DropDown 
            placeholder='Difficulty' 
            listItems={difficultyList} 
            onIndexChange={(index: number) => setDifficultySort(difficultyList[index].value)}
            reset={() => setDifficultySort(null)}
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
              difficulty={exercise.difficulty}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default ExerciseListScreen

import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { ComponentType, useEffect, useState } from "react"
import ScrollPickerGrid from "@components/actions/ScrollPickerGrid"
import ExerciseCard from "@components/common/ExerciseCard"
import DropDown from "@components/common/Dropdown"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import { thumbnailImages } from "@modules/AssetPaths"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"

type Props = NativeStackScreenProps<RootStackParamList, 'NewInstance'>

type InstanceData = {
  exerciseId: number | null,
  sets: number,
  reps: number | null,
  weight: number | null,
  duration: string | null
}

const NewInstanceScreen: ComponentType<Props> = ({ navigation, route }) => {
  const sessionId = route.params.sessionId

  const [instanceData, setInstanceData] = useState<InstanceData>({
    exerciseId: null,
    sets: 1,
    reps: 1 ,
    weight: null,
    duration: null 
  })
  const [exerciseList, setExerciseList] = useState<{
    id: number, 
    name: string, 
    thumbnail: keyof typeof thumbnailImages 
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

  const createInstance = () => {
    if (!instanceData.exerciseId) {
      navigation.navigate('ErrorModal', {
        title: 'No Exercise Selected', 
        message: 'Please select an exercise from the list.'
      })
      return
    }

    let pendingInstanceData: InstanceData = {...instanceData} 

    if (pendingInstanceData.reps === 1 && pendingInstanceData.duration !== null) {
      pendingInstanceData = {...pendingInstanceData, reps: null}
    }

    DB.sql(`
      SELECT MAX(instance_order) as maxOrder 
      FROM session_exercise_instances 
      WHERE session_id = ?;
    `, [sessionId], 
    (_, result) => {
      const maxOrder = result.rows._array[0].maxOrder || 0
      DB.sql(`
        INSERT INTO exercise_instances (exercise_id, sets, reps, duration, weight)
        VALUES (?, ?, ?, ?, ?);
      `, [
          pendingInstanceData.exerciseId,
          pendingInstanceData.sets,
          pendingInstanceData.reps,
          pendingInstanceData.duration,
          pendingInstanceData.weight
        ],
      (_, result) => {
        DB.sql(`
          INSERT INTO session_exercise_instances (session_id, exercise_instance_id, instance_order)
          VALUES (?, ?, ?);
        `, [sessionId, result.insertId, maxOrder + 1],
        () => navigation.pop())
      })
    })
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <ScrollPickerGrid 
          setInstanceSets={(value: number) => setInstanceData({...instanceData, sets: value})}
          setInstanceReps={(value: number) => setInstanceData({...instanceData, reps: value})}
          setInstanceWeight={(value: number) => setInstanceData({...instanceData, weight: value})}
          setInstanceDuration={(value: string) => setInstanceData({...instanceData, duration: value})}
          instanceDuration={instanceData.duration ? instanceData.duration : '0000'}
        />
        <View className="flex-1 mb-3 flex-row overflow-hidden justify-between">
          <View className="w-full flex-col">
            <View className="h-[15%] p-2 flex-row items-center justify-between">
              <Text className="text-custom-white mb-1 font-bold">Sort by</Text>
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
                  selectedId={instanceData?.exerciseId}
                  setSelectedId={(id: number) => setInstanceData(
                    {...instanceData, exerciseId: instanceData.exerciseId === id ? null : id}
                  )}
                  name={exercise.name}
                  thumbnail={exercise.thumbnail}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
      <BottomBarWrapper>
        <TouchableOpacity 
          className="flex-1 rounded-xl border border-custom-white flex-row justify-center items-center"
          onPress={() => {}}
        >
          <Text className="mr-2 text-custom-white font-bold">
            Create Exercise
          </Text>
          <Icon name="check" size={22} color="#F5F6F3" />
        </TouchableOpacity>
        <View className="w-3" />
        <TouchableOpacity 
          className="flex-1 bg-custom-blue rounded-xl flex-row justify-center items-center"
          onPress={createInstance}
        >
          <Text className="mr-2 text-custom-white font-bold">
            Add to Session
          </Text>
          <Icon name="check" size={22} color="#F5F6F3" />
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default NewInstanceScreen

import { View, Text, ScrollView, ImageBackground, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import ScreenWrapper from "@components/common/ScreenWrapper"
import { muscleGroups } from "@modules/AssetPaths"
import { useEffect, useState } from "react"
import DB from "@modules/DB"

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetails'>

const ExerciseDetailsScreen: React.FC<Props> = ({ route }) => {
  const exerciseId = route.params.exerciseId

  const [exerciseMuscleGroups, setExerciseMuscleGroups] = useState<{ name: string, group: number, load: number }[]>([])

  const fetchMuscleGroups = () => {
    DB.sql(`
      SELECT emg.load AS muscleGroupLoad,
             mg.id AS muscleGroupId,
             mg.name AS muscleGroupName
      FROM exercise_muscle_groups emg
      LEFT JOIN muscle_groups mg
      ON emg.muscle_group_id = mg.id
      WHERE emg.exercise_id = ?;
    `, [exerciseId],
    (_, result) => {
      const muscleGroups = result.rows._array.map(item => {
        return {
          name: item.muscleGroupName,
          group: item.muscleGroupId,
          load: item.muscleGroupLoad
        }
      })

      setExerciseMuscleGroups(muscleGroups)
    })
  }

  useEffect(() => {
    fetchMuscleGroups()
  }, [])
  
  return (
    <ScreenWrapper>
      <Text className="text-custom-white">Details</Text>
      <View className="h-2/3 w-full relative">
        <Image className="absolute w-full h-full" resizeMode="contain" 
          source={muscleGroups['base' as keyof typeof muscleGroups]}
        />
        {exerciseMuscleGroups.map((muscle, index) => {
          const fileName = `${muscle.group}-${muscle.load}` as keyof typeof muscleGroups
          return <Image key={index} className="absolute w-full h-full" resizeMode="contain" source={muscleGroups[fileName]} />
        })}
      </View>
    </ScreenWrapper>
  )
}

export default ExerciseDetailsScreen

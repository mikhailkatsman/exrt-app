import { View, Text, ScrollView, ImageBackground, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { Icon } from "@react-native-material/core"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { muscleGroups } from "@modules/AssetPaths"
import { useEffect, useState } from "react"
import DB from "@modules/DB"

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetails'>

const ExerciseDetailsScreen: React.FC<Props> = ({ route }) => {
  const exerciseId = route.params.exerciseId

  const [exerciseData, setExerciseData] = useState<{
    name: string,
    type: string, 
    difficulty: number,
    description: string,
    video: string,
    background: string,
    custom: number
  }>({ name: '', type: '', difficulty: 0, description: '', video: '', background: '', custom: 0 })
  const [exerciseMuscleGroups, setExerciseMuscleGroups] = useState<{
    name: string,
    group: number,
    load: number 
  }[]>([])

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

  const fetchExerciseData = () => {
    DB.sql(`
      SELECT * FROM exercises
      WHERE id = ?;
    `, [exerciseId],
    (_, result) => {
      const fetchedData = result.rows.item(0)
      setExerciseData({
        name: fetchedData.name,
        type: fetchedData.type,
        difficulty: fetchedData.difficulty,
        description: fetchedData.description,
        video: fetchedData.video,
        background: fetchedData.background,
        custom: fetchedData.custom
      })
    })
  }

  useEffect(() => {
    fetchMuscleGroups()
    fetchExerciseData()
  }, [])

  const renderDifficulty = () => {
    let difProps = {
      text: '',
      color: '',
    }

    switch (exerciseData.difficulty) {
      case 1:
        difProps.text = 'Beginner'
        difProps.color = '#74AC5D'
        break
      case 2:
        difProps.text = 'Intermediate'
        difProps.color = '#5AABD6'
        break
      case 3:
        difProps.text = 'Advanced'
        difProps.color = '#F7EA40'
        break
      case 4:
        difProps.text = 'Expert'
        difProps.color = '#F34A00'
        break
      case 5:
        difProps.text = 'Master'
        difProps.color = '#F4533E'
    }

    return (
      <View className="flex flex-row mb-8">
        <Text 
          className="text-lg font-BaiJamjuree-Bold mr-3"
          style={{ color: difProps.color }}
        >
          {difProps.text}
        </Text>
        <View className="flex flex-row mt-1">
          {Array.from({length: 5}).map((_, index) => {
            if (index < exerciseData.difficulty) {
              return <Icon key={index} name="star" color={difProps.color} size={18} /> 
            } else {
              return <Icon key={index} name="star-outline" color="#505050" size={18} /> 
            }
          })}
        </View>
      </View>
    )
  }
  
  return (
    <ScreenWrapper>
      <View className='w-2/3 -mt-1'>
        <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Difficulty:</Text>
      </View>
      {renderDifficulty()}
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

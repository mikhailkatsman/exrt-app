import { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useKeepAwake } from "expo-keep-awake";
import DB from "@modules/DB";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";
import TimeLine from "@components/activeSession/TimeLine";
import CurrentActivityContainer from "@components/activeSession/CurrentActivityContainer";
import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths";
import Progress from "@components/activeSession/Progress";

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId
  const sessionName: string = route.params.sessionName

  const [sessionTime, setSessionTime] = useState<number>(0)
  const [exerciseInstances, setExerciseInstances] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0)
  const [currentActivity, setCurrentActivity] = useState<{
    type: string, 
    data: {
      id: number,
      exerciseId: number,
      name: string,
      reps: number,
      background: keyof typeof exerciseBackgrounds,
      video: keyof typeof videoFiles,
      description: string,
      style: string,
      type: string
    } | number
  }>()

  useEffect(() => {
    DB.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.id AS exerciseId,
             exercises.name AS name,
             exercises.background AS background,
             exercises.style AS style,
             exercises.video AS video,
             exercises.description AS description,
             exercises.type AS type
      FROM session_exercise_instances
      JOIN exercise_instances
      ON session_exercise_instances.exercise_instance_id = exercise_instances.id
      JOIN exercises
      ON exercise_instances.exercise_id = exercises.id
      WHERE session_exercise_instances.session_id = ?
      ORDER BY instance_order ASC;
    `, [sessionId],
    (_: any, result: any) => {
      const instanceData = result.rows._array.map((row: any) => ({
        id: row.id,
        exerciseId: row.exerciseId,
        name: row.name,
        background: row.background,
        video: row.video,
        style: row.style,
        type: row.type,
        description: row.description,
        sets: row.sets,
        reps: row.reps || null,
        minuteDuration: row.minuteDuration || null,
        secondDuration: row.secondDuration || null,
        weight: row.weight || null
      }))

      let activityList: any[] = []

      setExerciseInstances(instanceData)

      instanceData.forEach((instance: any) => {
        for (let i = 0; i < instance.sets; i ++) {
          activityList.push({ type: 'exercise', data: instance })

          let restDuration

          if (instance.style === 'compound') {
            restDuration = (i === instance.sets - 1) ? 210 : 150
          }

          if (instance.style === 'isolation') {
            restDuration = (i === instance.sets - 1) ? 120 : 90
          }

          activityList.push({ type: 'rest', data: restDuration })
        }
      })

      activityList.pop()

      setActivities(activityList)
      setCurrentActivity(activityList[0])
    })

    const timeValue = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timeValue)
  }, [])

  useKeepAwake()

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
    const seconds = (totalSeconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const switchActivity = () => {
    setCurrentActivityIndex(currentActivityIndex + 1)
    setCurrentActivity(activities[currentActivityIndex + 1])
  }

  const finishSession = () => {
    // IMPLEMENT EndSessionScreen
    DB.sql(`
      UPDATE sessions
      SET status = 'completed'
      WHERE id = ?;
    `, [sessionId], 
    () => 
      navigation.replace('EndSession', { 
        sessionId: sessionId, 
        sessionName: sessionName,
        exerciseIds: exerciseInstances.map(instance => instance.exerciseId), 
        timeTotal: sessionTime 
      })
    )
  }

  const renderButtons = () => {
    if (currentActivity?.type === 'rest') {
      return (
        <TouchableOpacity className="flex-1 flex-row items-center 
          justify-center rounded-xl border-2 border-custom-red"
          onPress={switchActivity}
        >
          <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Skip Rest</Text>
          <Icon name="timer-outline" color="#F4533E" size={24} /> 
        </TouchableOpacity>
      )
    }

    if (currentActivityIndex === activities.length - 1) {
      return ( 
        <TouchableOpacity className="flex-1 flex-row items-center 
          justify-center rounded-xl border-2 border-custom-green"
          onPress={finishSession}
        >
          <Text className="mr-2 text-custom-green font-BaiJamjuree-Bold">Finish Session</Text>
          <Icon name="flag-checkered" color="#74AC5D" size={24} /> 
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity className="flex-1 flex-row items-center 
        justify-center rounded-xl border-2 border-custom-white"
        onPress={switchActivity}
      >
        <Text className="mr-2 text-custom-white font-BaiJamjuree-Bold">Complete</Text>
        <Icon name="dumbbell" color="#F5F6F3" size={24} /> 
      </TouchableOpacity>
    )
  }

  return currentActivity ? (
    <ScreenWrapper>
      <View className="flex-1 mt-5 mb-3">
        <Progress
          totalActivities={activities}
          currentActivity={currentActivityIndex}
          timeString={formatTime(sessionTime)}
        />
        <TimeLine 
          instances={activities} 
          currentActivityIndex={currentActivityIndex} 
        />
        <CurrentActivityContainer 
          activity={currentActivity} 
          nextActivity={switchActivity}
        />
      </View>
      <BottomBarWrapper>
        {renderButtons()}
      </BottomBarWrapper>
    </ScreenWrapper>
  ) : (
    <View className="bg-custom-dark flex-1" />
  )
}

export default ActiveSessionScreen

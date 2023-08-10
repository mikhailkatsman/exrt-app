import { ComponentType, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useKeepAwake } from "expo-keep-awake";
import DB from "@modules/DB";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";
import TimeLine from "@components/activeSession/TimeLine";
import CurrentActivity from "@components/activeSession/CurrentActivity";

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: ComponentType<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId

  const [instances, setInstances] = useState<any[]>([])
  const [currentActivity, setCurrentActivity] = 
    useState<{ type: string, data: {} | null }>({
      type: 'exercise',
      data: null 
    }) 

  useEffect(() => {
    DB.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.name AS name,
             exercises.style AS style,
             exercises.thumbnail AS thumbnail
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
        name: row.name,
        style: row.style,
        thumbnail: row.thumbnail,
        sets: row.sets,
        reps: row.reps || null,
        minuteDuration: row.minuteDuration || null,
        secondDuration: row.secondDuration || null,
        weight: row.weight || null
      }))

      setInstances(instanceData)
      setCurrentActivity({ type: 'exercise', data: instanceData[0] })
    })
  }, [])

  useKeepAwake()

  return (
    <ScreenWrapper>
      <View className="flex-1 my-3">
        <TimeLine instances={instances} />
        <CurrentActivity activity={currentActivity} />
      </View>
      <BottomBarWrapper>
        <TouchableOpacity className="
          flex-1 flex-row items-center justify-center 
          rounded-xl bg-custom-green"
        >
          <Text className="text-xs mr-2 text-custom-white font-BaiJamjuree-Bold">Start Session</Text>
          <Icon name="timer-outline" color="#F5F6F3" size={24} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default ActiveSessionScreen

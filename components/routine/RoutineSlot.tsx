import React, { useEffect, useState } from "react"
import { TouchableOpacity, Text, View, ScrollView } from "react-native"
import DB from '@modules/DB'
import TimeSlotInstanceCard from "@components/common/TimeSlotInstanceCard"
import { Icon } from "@react-native-material/core"
import { useNavigation } from "@react-navigation/native"

type Props = {
  routineId: number,
  session: { id: number, status: string },
}

const RoutineSlot: React.FC<Props> = ({ session, routineId }) => {
  const [instances, setInstances] = useState<any[]>([])

  const navigation = useNavigation()

  useEffect(() => {
    DB.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.name AS name,
             exercises.thumbnail AS thumbnail,
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
    `, [session.id],
    (_: any, result: any) => {
      const instanceData = result.rows._array.map((row: any) => ({
        id: row.id,
        name: row.name,
        thumbnail: row.thumbnail,
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

      setInstances(instanceData)
    })
  }, [session])

  return (
    <View className="flex-row justify-between flex-1 mb-2">
      <View className="w-full flex-row justify-between">
        <View className="w-[80%] flex-col">
          <Text className="mx-2 mt-1 text-custom-white font-BaiJamjuree-RegularItalic text-lg">Upcoming Session</Text>
          <View className="mx-2 border-b border-custom-white" />
          <ScrollView 
            className="m-2 rounded-xl"
            fadingEdgeLength={100}
          >
            {instances.map((instance, index) => (
              <TimeSlotInstanceCard 
                key={`instance-${index}`}
                id={instance.id}
                name={instance.name}
                thumbnail={instance.thumbnail}
                sets={instance.sets}
                reps={instance.reps}
                minuteDuration={instance.minuteDuration}
                secondDuration={instance.secondDuration}
                weight={instance.weight}
              />
            ))}
          </ScrollView>
        </View>
        <View className="w-[20%] flex-col">
          <TouchableOpacity 
            className="
              mt-1 mr-1 mb-0.5 
              flex-1 items-center justify-center
              border border-custom-white rounded
            "
            onPress={() => navigation.navigate("EditSession", { 
              routineId: routineId,
              sessionExists: true,
              sessionId: session.id, 
            })}
          >
            <Icon name="pencil" size={22} color="#F5F6F3" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="
              mt-0.5 mr-1 mb-1 
              flex-1 items-center justify-center
              border border-custom-blue rounded
            "
            onPress={() => navigation.navigate("GetReady", {
              sessionId: session.id,
            })}
          >
            <Icon name="dumbbell" size={28} color="#5AABD6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RoutineSlot

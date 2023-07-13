import React, { useEffect, useState } from "react"
import { TouchableOpacity, Text, View, ScrollView } from "react-native"
import db from '../../modules/DB'
import InstanceCard from "../common/InstanceCard"
import { Icon } from "@react-native-material/core"

type Props = {
  routine: { time: string, id: number },
}

const TimeSlot: React.FC<Props> = ({ routine }) => {
  const [exercises, setExercises] = useState<any[]>([])

  useEffect(() => {
    db.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.duration AS duration, 
             exercise_instances.weight AS weight,
             exercises.name as name,
             exercises.thumbnail AS thumbnail
      FROM session_exercise_instances
      JOIN exercise_instances
      ON session_exercise_instances.exercise_instance_id = exercise_instances.id
      JOIN exercises
      ON exercise_instances.exercise_id = exercises.id
      WHERE session_exercise_instances.session_id = ?;
    `, [routine.id],
    (_, result) => {
      const exerciseData = result.rows._array.map(row => ({
        id: row.id,
        name: row.name,
        thumbnail: row.thumbnail,
        sets: row.sets,
        reps: row.reps || null,
        duration: row.duration || null,
        weight: row.weight || null
      }))

      setExercises(exerciseData)
    })
  }, [routine])

  return (
    <View className="flex-row flex-shrink flex-1 mb-2">
      <View className="w-[14%] pr-1 justify-center">
        <Text className="text-custom-blue font-extrabold">{routine.time}</Text>
      </View>
      <View className="w-[8%] h-1/2 border-b border-custom-grey"/>
      <View
        className="
          w-[78%] flex-row overflow-hidden
          justify-between rounded-xl
          border border-custom-grey
        "
      >
        <View className="w-[80%] flex-col">
          <Text className="m-2 text-custom-white text-lg">Upcoming Session</Text>
          <View className="mx-2 border-b border-custom-grey" />
          <ScrollView 
            className="p-2 rounded-xl bg-custom-dark"
            fadingEdgeLength={100}
          >
            {exercises.map((instance, index) => (
              <InstanceCard 
                key={`instance-${index}`}
                id={instance.id}
                name={instance.name}
                thumbnail={instance.thumbnail}
                sets={instance.sets}
                reps={instance.reps}
                duration={instance.duration}
                weight={instance.weight}
              />
            ))}
          </ScrollView>
        </View>
        <View className="w-[20%] flex-col">
          <TouchableOpacity className="
            mt-1 mr-1 mb-0.5 
            flex-1 items-center justify-center
            border-2 border-custom-grey 
            rounded-lg"
          >
            <Icon name="pencil" size={24} color="#4D594A" />
          </TouchableOpacity>
          <TouchableOpacity className="
            mt-0.5 mr-1 mb-1 
            flex-1 items-center justify-center
            border-2 border-custom-blue 
            rounded-lg"
          >
            <Icon name="play" size={36} color="#2EB9DC" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default TimeSlot

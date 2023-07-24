import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { ComponentType, useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import { Icon } from "@react-native-material/core"
import InstanceCard from "@components/common/InstanceCard"
import DB from "@modules/DB"

type Props = NativeStackScreenProps<RootStackParamList, 'NewSession'>

const NewSessionsScreen: ComponentType<Props> = ({ navigation, route }) => {
  const routineId = route.params?.routineId
  const sessionTime = route.params?.sessionTime
  const sessionId = route.params?.sessionId
  const [instances, setInstances] = useState<any[]>([])
  
  useEffect(() => {
    DB.sql(`
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
    `, [sessionId],
    (_, result) => {
      const instanceData = result.rows._array.map(row => ({
        id: row.id,
        name: row.name,
        thumbnail: row.thumbnail,
        sets: row.sets,
        reps: row.reps,
        duration: row.duration,
        weight: row.weight
      }))

      setInstances(instanceData)
    })
  }, [])

  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
  console.log(sessionId ? `Selected session: ${sessionId}` : 'Setting up new session')
  sessionTime && console.log('Session time: ' + sessionTime)

  const createSession = () => {
    DB.sql()
  }

  return (
    <View className="h-full w-full p-2 bg-custom-dark">
      <View
        className="
          w-full h-[90%] mb-4 flex-row overflow-hidden
          justify-between rounded-xl
          border border-custom-white
        "
      >
        <View className="w-full flex-col">
          <Text className="m-2 text-custom-white text-lg">Upcoming Session</Text>
          <View className="mx-2 border-b border-custom-white" />
          <ScrollView 
            className="p-2 rounded-xl bg-custom-dark"
            horizontal={false}
          >
            {instances.map((instance, index) => (
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
            <TouchableOpacity className="
              w-full h-12 mb-2 
              border border-custom-white rounded-lg 
              flex justify-center items-center"
              onPress={() => navigation.navigate("NewInstance", { sessionId: sessionId })}
            >
              <Icon name="plus" size={30} color="#F5F6F3" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity 
        className="w-full h-[8%] bg-custom-blue rounded-xl flex justify-center items-center"
        onPress={() => {
          createSession
          navigation.pop()
        }}
      >
        <Text className="text-custom-white font-bold text-lg">Add Session to Routine</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NewSessionsScreen

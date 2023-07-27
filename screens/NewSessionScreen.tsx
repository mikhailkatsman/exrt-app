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
  const sessionExists = route.params.sessionExists
  const sessionTime = route.params.sessionTime
  const sessionId = route.params.sessionId
  const [instances, setInstances] = useState<any[]>([])

  const fetchInstances = () => {
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
    (_:any, result: any) => {
      console.log(`Instances for session id: ${sessionId} Fetched`)
      const instanceData = result.rows._array.map((row: any) => ({
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
  }

  const registerSession = () => {
    if (sessionExists && instances.length !== 0) {
      navigation.pop()
    } else {
      if (instances.length !== 0) {
        DB.sql(`
          INSERT INTO weekly_session_instances (day_id, session_id)
          VALUES (?, ?);
        `, [routineId, sessionId],
        (_: any, result: any) => {
          console.log(`New Session id:${sessionId} created on day: ${routineId} with row id: ${result.insertId}`)
          navigation.pop()
        })
      } else {
        console.log('No Instances Added. Please Add instances before finalizing session creation')
      }
    }
  }

  const deleteSession = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        DELETE FROM weekly_session_instances
        WHERE session_id = ?;
      `, [sessionId], () => console.log('weekly session instances entry deleted'))

      tx.executeSql(`
        DELETE FROM sessions
        WHERE id = ?;
      `, [sessionId], () => console.log('sessions entry deleted'))

      tx.executeSql(`
        DELETE FROM session_exercise_instances
        WHERE session_id = ?;
      `, [sessionId], () => console.log('session exercise instances entry deleted'))

      tx.executeSql(`
        DELETE FROM exercise_instances
        WHERE id IN (
          SELECT exercise_instance_id
          FROM session_exercise_instances
          WHERE session_id = ?
        );
      `, [sessionId], (_, result) => console.log('exercise instances entry deleted'))
    },
      error => console.log('Error deleting session from DB: ' + error),
      () => navigation.pop()
    )
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchInstances)
    
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log(`Selected session: ${sessionId}`)
    sessionTime && console.log('Session time: ' + sessionTime)

    return () => { unsubscribeFocus() }
  }, [])

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
            className="p-3 rounded-xl bg-custom-dark"
            horizontal={false}
          >
            {instances.map((instance, index) => (
              <InstanceCard 
                key={`instance-${index}`}
                updateInstances={fetchInstances}
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
      <View className="h-[8%] w-full flex-row items-center justify-between">
        <TouchableOpacity 
          className="w-[30%] h-full bg-custom-red rounded-xl flex-row justify-center items-center"
          onPress={deleteSession}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-white font-bold">Delete</Text>
          <Icon name="delete-outline" size={22} color="#F5F6F3" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-[67%] h-full bg-custom-blue rounded-xl flex-row justify-center items-center"
          onPress={registerSession}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-white font-bold">Confirm Session</Text>
          <Icon name="check" size={22} color="#F5F6F3" />
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default NewSessionsScreen

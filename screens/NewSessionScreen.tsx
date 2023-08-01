import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { ComponentType, useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DraggableFlatList, { OpacityDecorator, RenderItemParams } from 'react-native-draggable-flatlist'
import { Icon } from "@react-native-material/core"
import InstanceCard from "@components/common/InstanceCard"
import DB from "@modules/DB"
import { thumbnailImages } from "@modules/AssetPaths"

type Props = NativeStackScreenProps<RootStackParamList, 'NewSession'>

type Instance = {
  key: string,
  id: number,
  name: string,
  thumbnail: keyof typeof thumbnailImages,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  duration: number | null
}

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
    (_, result) => {
      const instanceData = result.rows._array.map((row, index) => ({
        key: `item=${index}`,
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

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Instance>) => {
    return (
      <OpacityDecorator activeOpacity={0.6}>
        <InstanceCard 
          updateInstances={fetchInstances}
          drag={drag}
          isActive={isActive}
          key={item.key}
          id={item.id}
          name={item.name}
          thumbnail={item.thumbnail}
          sets={item.sets}
          reps={item.reps}
          duration={item.duration}
          weight={item.weight}
        />
      </OpacityDecorator>
    )
  }

  const registerSession = () => {
    if (instances.length === 0) {
      navigation.navigate('ErrorModal', { 
        title: 'No Exercises Added', 
        message: 'Please add at least one exercise to this session.'
      })
      return
    }

    if (sessionExists) {
      navigation.pop()
    } else {
      DB.sql(`
        INSERT INTO weekly_session_instances (day_id, session_id)
        VALUES (?, ?);
      `, [routineId, sessionId],
      () => navigation.pop())
    }
  }

  const deleteSession = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        DELETE FROM weekly_session_instances
        WHERE session_id = ?;
      `, [sessionId])

      tx.executeSql(`
        DELETE FROM sessions
        WHERE id = ?;
      `, [sessionId])

      tx.executeSql(`
        DELETE FROM session_exercise_instances
        WHERE session_id = ?;
      `, [sessionId])

      tx.executeSql(`
        DELETE FROM exercise_instances
        WHERE id IN (
          SELECT exercise_instance_id
          FROM session_exercise_instances
          WHERE session_id = ?
        );
      `, [sessionId])
    },
      error => console.log('Error deleting session from DB: ' + error),
      () => navigation.pop()
    )
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchInstances)

    return () => { 
      unsubscribeFocus()
    }
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
          <View className="p-3 w-full h-[20%] flex-col justify-between">
            <Text className="text-custom-white text-lg font-BaiJamjuree-RegularItalic">Upcoming Session</Text>
            <View className="border-b border-custom-white" />
          </View>
          <DraggableFlatList 
            className="p-3 h-[68%] rounded-xl"
            data={instances}
            onDragEnd={({ data }) => {
              console.log(data)
              setInstances(data)}
            }
            keyExtractor={item => item.key}
            renderItem={renderItem}
            dragItemOverflow={true}
          />
          <View className="w-full h-[12%] p-2">
            <TouchableOpacity className="
              flex-1 border border-custom-white rounded-lg 
              flex-row justify-center items-center"
              onPress={() => navigation.navigate("NewInstance", { sessionId: sessionId })}
            >
              <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Add New Exercise</Text>
              <Icon name="plus" size={24} color="#F5F6F3" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="h-[8%] w-full flex-row items-center justify-between">
        <TouchableOpacity 
          className="w-[30%] h-full bg-custom-red rounded-xl flex-row justify-center items-center"
          onPress={() => {
            navigation.navigate('ConfirmModal', {
              text: 'Are you sure you want to delete this session?',
              onConfirm: deleteSession
            })
          }}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-white font-BaiJamjuree-Bold">Delete</Text>
          <Icon name="delete-outline" size={22} color="#F5F6F3" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-[67%] h-full bg-custom-blue rounded-xl flex-row justify-center items-center"
          onPress={registerSession}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-white font-BaiJamjuree-Bold">Confirm Session</Text>
          <Icon name="check" size={22} color="#F5F6F3" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NewSessionsScreen

import { View, Text, TouchableOpacity, BackHandler } from "react-native"
import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DraggableFlatList, { OpacityDecorator, RenderItemParams } from 'react-native-draggable-flatlist'
import { HeaderBackButton } from '@react-navigation/elements'
import { Icon } from "@react-native-material/core"
import InstanceCard from "@components/common/InstanceCard"
import DB from "@modules/DB"
import { exerciseThumbnails } from "@modules/AssetPaths"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"

type Props = NativeStackScreenProps<RootStackParamList, 'EditSession'>

type Instance = {
  key: number,
  id: number,
  name: string,
  thumbnail: keyof typeof exerciseThumbnails,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  minuteDuration: number | null,
  secondDuration: number | null,
}

const EditSessionsScreen: React.FC<Props> = ({ navigation, route }) => {
  const routineId = route.params?.routineId ?? 1
  const sessionExists = route.params.sessionExists
  const sessionId = route.params.sessionId
  const phaseId = route.params.phaseId
  const [instances, setInstances] = useState<any[]>([])

  const fetchInstances = () => {
    DB.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.name as name,
             exercises.thumbnail AS thumbnail
      FROM session_exercise_instances
      JOIN exercise_instances
      ON session_exercise_instances.exercise_instance_id = exercise_instances.id
      JOIN exercises
      ON exercise_instances.exercise_id = exercises.id
      WHERE session_exercise_instances.session_id = ?
      ORDER BY instance_order ASC;
    `, [sessionId],
    (_, result) => {
      const instanceData = result.rows._array.map((row, index) => ({
        key: index.toString(),
        id: row.id,
        name: row.name,
        thumbnail: row.thumbnail,
        sets: row.sets,
        reps: row.reps,
        minuteDuration: row.minuteDuration,
        secondDuration: row.secondDuration,
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
          minuteDuration={item.minuteDuration}
          secondDuration={item.secondDuration}
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
        INSERT INTO phase_session_instances (day_id, session_id, phase_id)
        VALUES (?, ?);
      `, [routineId, sessionId, phaseId],
      () => navigation.pop())
    }
  }

  const deleteSession = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        DELETE FROM exercise_instances
        WHERE id IN (
          SELECT exercise_instance_id
          FROM session_exercise_instances
          WHERE session_id = ?
        );
      `, [sessionId])

      tx.executeSql(`
        DELETE FROM phase_session_instances
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
    },
      error => console.log('Error deleting session from DB: ' + error),
      () => navigation.pop()
    )
  }

  const updateInstanceOrder = (data: any) => {
    setInstances(data)

    DB.transaction(tx => {
      data.forEach((instance: Instance, index: number) => {
        tx.executeSql(`
          UPDATE session_exercise_instances 
          SET instance_order = ? 
          WHERE exercise_instance_id = ? 
          AND session_id = ?;
        `, [index + 1, instance.id, sessionId])
      })
    },
      error => console.log('Error updating instance order: ' + error),
    )
  }

  const onBackPressed = () => {
    navigation.navigate('DismissModal', {
      onConfirm: () => {
        if (instances.length === 0 && !sessionExists) {
          deleteSession()
        } else {
          navigation.pop()
        }
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        onBackPressed()
        return true
      })
    }, [])
  )

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchInstances)

    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          style={{ marginLeft: -4, marginRight: 30 }}
          onPress={onBackPressed}
        />      
      )
    })

    return () => { 
      unsubscribeFocus()
    }
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3 rounded-xl
        border border-custom-white flex-col justify-between"
      >
        <View className="p-3 h-32 flex-col justify-between">
          <Text className="text-custom-white text-lg font-BaiJamjuree-RegularItalic">Upcoming Session</Text>
          <View className="border-b border-custom-white" />
        </View>
        <View className="flex-1">
          <DraggableFlatList 
            className="p-3 rounded-xl"
            data={instances}
            onDragEnd={({ data }) => updateInstanceOrder(data)}
            keyExtractor={(item: any) => item.key}
            renderItem={renderItem}
            dragItemOverflow={true}
            fadingEdgeLength={200}
          />
        </View>
        <View className="h-20 p-2">
          <TouchableOpacity className="
            flex-1 border-2 border-custom-white rounded-lg 
            flex-row justify-center items-center"
            onPress={() => navigation.navigate("NewInstance", { sessionId: sessionId })}
          >
            <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Add New Exercise</Text>
            <Icon name="plus" size={24} color="#F5F6F3" />
          </TouchableOpacity>
        </View>
      </View>
      <BottomBarWrapper>
        <TouchableOpacity 
          className="w-[30%] rounded-xl border-2 border-custom-red flex-row justify-center items-center"
          onPress={() => {
            navigation.navigate('ConfirmModal', {
              text: 'Are you sure you want to delete this session?',
              onConfirm: deleteSession
            })
          }}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Delete</Text>
          <Icon name="delete-outline" size={20} color="#F4533E" />
        </TouchableOpacity>
        <View className="w-3" />
        <TouchableOpacity 
          className="flex-1 border-2 border-custom-blue rounded-xl flex-row justify-center items-center"
          onPress={registerSession}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-blue font-BaiJamjuree-Bold">Confirm Session</Text>
          <Icon name="check" size={22} color="#5AABD6" />
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditSessionsScreen

import { View, Text, TextInput, TouchableOpacity, BackHandler } from "react-native"
import { useEffect, useState, useCallback, useRef } from "react"
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
  const dayId = route.params.dayId
  const sessionId = route.params.sessionId
  const sessionName = route.params.sessionName
  const newSession = route.params.newSession
  const phaseId = route.params.phaseId
  const [instances, setInstances] = useState<any[]>([])
  const [name, setName] = useState<string>(sessionName)
  const [isEditableSessionName, setIsEditableSessionName] = useState<boolean>(false)

  const sessionNameInputRef = useRef<TextInput>(null)

  const fetchInstances = () => {
    DB.sql(`
      SELECT sessions.name as sessionName,
             exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.name as name,
             exercises.thumbnail AS thumbnail
      FROM session_exercise_instances
      JOIN sessions ON sessions.id = session_exercise_instances.session_id
      JOIN exercise_instances
        ON session_exercise_instances.exercise_instance_id = exercise_instances.id
      JOIN exercises ON exercise_instances.exercise_id = exercises.id
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
      
      if (result.rows.length > 0) {
        setName(result.rows.item(0).sessionName)
      }
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
        message: 'Please add at least one exercise to this session or delete this session.'
      })
      return
    }

    DB.transaction(tx => {
      tx.executeSql(`
        INSERT OR IGNORE 
          INTO phase_session_instances (day_id, session_id, phase_id)
        VALUES (?, ?, ?);
      `, [dayId, sessionId, phaseId])

      tx.executeSql(`
        UPDATE sessions
        SET name = ?
        WHERE id = ?;
      `, [name, sessionId])
    },
    error => console.error(error),
    () => navigation.pop())
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

  const handlePress = () => {
    setIsEditableSessionName(true)
  }

  useEffect(() => {
    if (isEditableSessionName && sessionNameInputRef.current) {
      sessionNameInputRef.current?.focus()
    }
  }, [isEditableSessionName])

  const onBackPressed = () => {
    if (instances.length === 0) {
      navigation.navigate('ErrorModal', { 
        title: 'No Exercises Added', 
        message: 'Please add at least one exercise to this session or delete this session.'
      })
      return
    } else {
      navigation.navigate('DismissModal', {
        onConfirm: () => {
          if (newSession) {
            deleteSession()
          } else {
            navigation.pop()
          }
        }
      })
    }
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
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          style={{ marginLeft: -4, marginRight: 30 }}
          onPress={onBackPressed}
        />      
      )
    })
  }, [instances])

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchInstances)

    return () => { 
      unsubscribeFocus()
    }
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3 flex-col justify-between">
        <View className="p-3 h-fit flex-col justify-between">
          <View className='w-full mb-1 flex-row justify-between items-center'>
            <View className='w-2/3 -mt-1'>
              <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Session Name:</Text>
            </View>
            <TouchableOpacity 
              className="w-1/3 h-8 flex-row items-start justify-end"
              onPress={handlePress}
            >
              <Icon name="pencil" color="#F5F6F3" size={22} /> 
            </TouchableOpacity>
          </View>
          <TextInput
            ref={sessionNameInputRef}
            onChangeText={setName}
            className="w-[90%] text-custom-white text-xl font-BaiJamjuree-Bold"
            autoCapitalize="words"
            defaultValue={name}
            selectionColor="#F5F6F3"
            editable={isEditableSessionName}
            onSubmitEditing={() => setIsEditableSessionName(false)}
          />
        </View>
        <Text className="p-3 text-custom-white font-BaiJamjuree-MediumItalic">Exercises:</Text>
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
        <View className="h-16">
          <TouchableOpacity className="
            flex-1 border-2 border-custom-white rounded-xl 
            flex-row justify-center items-center"
            onPress={() => navigation.navigate("NewInstance", { sessionId: sessionId })}
            activeOpacity={0.6}
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
          activeOpacity={0.6}
        >
          <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Delete</Text>
          <Icon name="delete-outline" size={20} color="#F4533E" />
        </TouchableOpacity>
        <View className="w-3" />
        <TouchableOpacity 
          className="flex-1 border-2 border-custom-blue rounded-xl flex-row justify-center items-center"
          onPress={registerSession}
          activeOpacity={0.6}
        >
          <Text className="mr-2 text-custom-blue font-BaiJamjuree-Bold">Confirm Session</Text>
          <Icon name="check" size={22} color="#5AABD6" />
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditSessionsScreen

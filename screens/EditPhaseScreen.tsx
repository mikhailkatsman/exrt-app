import { Text, View, TouchableOpacity, TextInput } from "react-native"
import { Icon } from "@react-native-material/core"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { type NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist"

type Props = NativeStackScreenProps<RootStackParamList, 'EditPhase'>

type ListItem = {
  type: 'weekday' | 'session',
  dayId: number,
  dayName?: string,
  sessionId?: number,
  sessionName?: string,
  totalExercises?: number
}

const EditPhaseScreen: React.FC<Props> = ({ navigation, route }) => {
  const phaseId: number = route.params.phaseId
  const phaseName: string = route.params.phaseName
  const phaseStatus: string = route.params.phaseStatus

  const [listData, setListData] = useState<ListItem[]>([])
  const [name, setName] = useState<string>(phaseName)
  const [isEditingName, setIsEditingName] = useState<boolean>(false)

  const fetchSessions = () => {
    DB.sql(`
      SELECT s.name AS sessionName,
             sei.session_id AS sessionId, 
             psi.day_id AS dayId,
             COUNT(sei.exercise_instance_id) AS totalExercises
      FROM phase_session_instances psi
      INNER JOIN session_exercise_instances sei
      ON psi.session_id = sei.session_id
      INNER JOIN sessions s
      ON s.id = psi.session_id
      WHERE psi.phase_id = ?
      GROUP BY psi.day_id,
               sei.session_id;
    `, [phaseId],
    (_, result) => {
      let dataArray: ListItem[] = [
        { type: 'weekday', dayId: 2, dayName: 'Tuesday' },
        { type: 'weekday', dayId: 3, dayName: 'Wednesday' },
        { type: 'weekday', dayId: 4, dayName: 'Thursday' },
        { type: 'weekday', dayId: 5, dayName: 'Friday' },
        { type: 'weekday', dayId: 6, dayName: 'Saturday' },
        { type: 'weekday', dayId: 7, dayName: 'Sunday' },
      ]

      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i)

        if (item.dayId === 1) {
          dataArray.unshift({
            type: 'session',
            sessionId: item.sessionId,
            sessionName: item.sessionName,
            dayId: item.dayId,
            totalExercises: item.totalExercises,
          })
        } else {
          const dayIndex = dataArray.findIndex(dayItem => dayItem.dayId === item.dayId)

          dataArray.splice(dayIndex + 1, 0, {
            type: 'session',
            sessionId: item.sessionId,
            sessionName: item.sessionName,
            dayId: item.dayId,
            totalExercises: item.totalExercises,
          })
        }
      }

      setListData(dataArray)
    })
  }

  const deletePhase = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        DELETE FROM exercise_instances
        WHERE id IN (
          SELECT sei.exercise_instance_id
          FROM session_exercise_instances sei
          JOIN sessions s ON s.id = sei.session_id
          JOIN phase_session_instances psi ON psi.session_id = s.id
          WHERE psi.phase_id = ?
        );
      `, [phaseId])

      tx.executeSql(`
        DELETE FROM session_exercise_instances
        WHERE session_id IN (
          SELECT s.id 
          FROM sessions s
          JOIN phase_session_instances psi ON psi.session_id = s.id
          WHERE psi.phase_id = ?
        );
      `, [phaseId])

      tx.executeSql(`
        DELETE FROM sessions
        WHERE id IN (
          SELECT s.id 
          FROM sessions s
          JOIN phase_session_instances psi ON psi.session_id = s.id
          WHERE psi.phase_id = ?
        );
      `, [phaseId])

      tx.executeSql(`
        DELETE FROM phase_session_instances
        WHERE phase_id = ?;
      `, [phaseId])

      tx.executeSql(`
        DELETE FROM phases
        WHERE id = ?;
      `, [phaseId])
    }, 
      error => console.error('Error deleting phase from DB: ' + error),
      () => navigation.pop())
  }

  const renderItem = ({ 
    item, 
    getIndex, 
    drag, 
    isActive
  }: RenderItemParams<ListItem>) => {
    const index = getIndex()
    

    if (item.type === 'session') {
      return (
        <View className="flex-row items-center">
          <View 
            className="ml-1.5 border-l border-custom-grey h-24" 
          />
          <View 
            className="p-3 ml-4 h-20 flex-1 flex-row rounded-xl bg-custom-dark border-x-2 border-custom-white"
          >
            <TouchableOpacity
              className="flex-1 justify-center"
              onPress={() => navigation.navigate('EditSession', { 
                sessionExists: true, 
                sessionId: item.sessionId, 
                sessionName: item.sessionName ?? null,
                phaseId: phaseId 
              })}
              activeOpacity={0.6}
              disabled={isActive}
            >
              <Text className="text-xl text-custom-white font-BaiJamjuree-Bold">
                {item.sessionName}
              </Text>
              <Text className="text-xl text-custom-white font-BaiJamjuree-LightItalic">
                {item.totalExercises} {item.totalExercises! > 1 ? 'exercises': 'exercise'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-[13%] h-full flex items-end justify-center"
              onPressIn={drag}
              activeOpacity={1}
              disabled={isActive}
            >
              <Icon name="unfold-more-horizontal" size={30} color='#F5F6F3' />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    let nextItem
    if (typeof index === 'number' && index < listData.length - 1) {
      nextItem = listData[index + 1]
    }

    let bdColor: string = '#5AABD6'
    let bgColor: string = '#5AABD6'
    if (nextItem?.type === 'weekday' || index === listData.length - 1) {
      bdColor = '#505050'
      bgColor = 'transparent'
    }
    
    return (
      <View className="flex-row items-center">
        <View 
          className="mr-3 w-3 h-3 rounded border"
          style={{
            backgroundColor: bgColor,
            borderColor: bdColor,
          }}
        />
        <Text 
          className="mt-1 font-BaiJamjuree-Bold text-lg"
          style={{ color: bdColor }}
        >
          {item.dayName}
        </Text>
      </View>
    )
  }

  const updateSessionDay = (data: any, from: number, to: number) => {
    if (from === to) return

    setListData(data)

    const draggedItem = data[to]
    let newDayId = 1
    for (let i = to - 1; i >= 0; i--) {
      if (data[i].type === 'weekday') {
        newDayId = data[i].dayId
        break
      }
    }

    if (newDayId !== draggedItem.dayId) {
      DB.sql(`
        UPDATE phase_session_instances
        SET day_id = ?
        WHERE session_id = ?;
      `, [newDayId, draggedItem.sessionId])
    }
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchSessions)

    return () => {
      unsubscribeFocus()
    }
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 px-3 mb-3">
        <View className="py-3 h-36 flex-col justify-between">
          {isEditingName ? 
            <TextInput 
              onChangeText={setName}
              onSubmitEditing={() => setIsEditingName(false)}
              className="w-full text-custom-white text-xl font-BaiJamjuree-Bold"
              autoCapitalize="words"
              defaultValue={name}
              autoFocus={true}
            />
          :
            <TouchableOpacity
              className="w-full"
              onPress={() => setIsEditingName(true)}
            >
              <View className='w-full mb-1 flex-row justify-between items-center'>
                <View className='w-5/6 -mt-1'>
                  <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Phase Name:</Text>
                </View>
                <View className="w-1/6 h-full flex-row items-start justify-end">
                  <Icon name="pencil" color="#F5F6F3" size={22} /> 
                </View>
              </View>
              <Text className="text-custom-white text-2xl font-BaiJamjuree-Bold">{name}</Text>
            </TouchableOpacity>
          }
          <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Exercises:</Text>
        </View>
        <View className="flex-1 mb-7">
          <View className="flex-row items-center">
            <View 
              className="mr-3 w-3 h-3 rounded border"
              style={{
                backgroundColor: listData[0]?.type === 'session' ? '#5AABD6' : 'transparent',
                borderColor: listData[0]?.type === 'session' ? '#5AABD6' : '#505050',
              }}
            />
            <Text 
              className="mt-1 font-BaiJamjuree-Bold text-lg"
              style={{ color: listData[0]?.type === 'session' ? '#5AABD6' : '#505050' }}
            >
              Monday
            </Text>
          </View>
          <DraggableFlatList
            data={listData}
            onDragEnd={({ data, from, to }) => updateSessionDay(data, from, to)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
      <View className="h-16 mb-3">
        <TouchableOpacity className="
          flex-1 border-2 border-custom-white rounded-xl 
          flex-row justify-center items-center"
          onPress={() => navigation.navigate('SelectDayModal', { phaseId: phaseId })}
        >
          <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Add New Session</Text>
          <Icon name="plus" size={24} color="#F5F6F3" />
        </TouchableOpacity>
      </View>
      <BottomBarWrapper>
        <TouchableOpacity 
          className="w-[30%] rounded-xl border-2 border-custom-red flex-row justify-center items-center"
          onPress={() => {
            navigation.navigate('ConfirmModal', {
              text: 'Are you sure you want to delete this phase?',
              onConfirm: deletePhase
            })
          }}
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Delete</Text>
          <Icon name="delete-outline" size={20} color="#F4533E" />
        </TouchableOpacity>
        <View className="w-3" />
        <TouchableOpacity className="
          flex-1 border-2 border-custom-blue
          flex-row items-center justify-center 
          rounded-xl"
          onPress={() => navigation.pop()}
        >
          <Text className="text text-custom-blue mr-2 font-BaiJamjuree-Bold">
            Confirm Phase
          </Text>
          <Icon name="check" color="#5AABD6" size={22} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditPhaseScreen

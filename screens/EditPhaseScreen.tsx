import { Text, View, TouchableOpacity, TextInput, BackHandler } from "react-native"
import { Icon } from "@react-native-material/core"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { HeaderBackButton } from '@react-navigation/elements'
import { type NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState, useCallback, useRef } from "react"
import { useFocusEffect } from "@react-navigation/native"
import DB from "@modules/DB"
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist"

type Props = NativeStackScreenProps<RootStackParamList, 'EditPhase'>

type ListItem = {
  type: 'weekday' | 'session',
  dayId: number,
  dayName?: string,
  sessionId?: number,
  sessionName?: string,
  sessionCustom?: number,
  totalExercises?: number
}

const EditPhaseScreen: React.FC<Props> = ({ navigation, route }) => {
  const phaseId: number = route.params.phaseId
  const programId: number = route.params.programId
  const phaseName: string = route.params.phaseName
  const phaseStatus: string = route.params.phaseStatus
  const phaseCustom: number = route.params.phaseCustom
  const phaseOrder: number = route.params.phaseOrder
  const newPhase: boolean = route.params.newPhase

  const [listData, setListData] = useState<ListItem[]>([])
  const [name, setName] = useState<string>(phaseName)
  const [status, setStatus] = useState<string>(phaseStatus)
  const [isEditable, setIsEditable] = useState<boolean>(() => newPhase ? true : false)
  const [isEditablePhaseName, setIsEditablePhaseName] = useState<boolean>(false)

  const phaseNameInputRef = useRef<TextInput>(null)

  const fetchPhaseData = () => {
    DB.sql(`
      SELECT s.name AS sessionName,
             s.custom AS sessionCustom,
             sei.session_id AS sessionId, 
             psi.day_id AS dayId,
             COUNT(sei.exercise_instance_id) AS totalExercises
      FROM phase_session_instances psi
      LEFT JOIN session_exercise_instances sei
      ON psi.session_id = sei.session_id
      LEFT JOIN sessions s
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
            sessionCustom: item.sessionCustom,
            dayId: item.dayId,
            totalExercises: item.totalExercises,
          })
        } else {
          const dayIndex = dataArray.findIndex(dayItem => dayItem.dayId === item.dayId)

          dataArray.splice(dayIndex + 1, 0, {
            type: 'session',
            sessionId: item.sessionId,
            sessionName: item.sessionName,
            sessionCustom: item.sessionCustom,
            dayId: item.dayId,
            totalExercises: item.totalExercises,
          })
        }
      }

      setListData(dataArray)
    })
  }

  const changePhaseStatus = () => {
    DB.sql(`
      UPDATE phases
      SET status = ?
      WHERE id = ?;
    `, ['completed', phaseId],
    (_, result) => {
      setStatus('completed')

      DB.sql(`
        UPDATE phases
        SET status = ?
        WHERE id IN (
          SELECT phase_id
          FROM program_phases
          WHERE program_id = ?
          AND phase_order = ?
        );
      `, ['active', programId, phaseOrder + 1], 
      (_, result) => {
        if (result.rows.item.length === 0) {
          console.log('LAST PHASE. COMPLETE PROGRAM')
        }
      })
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
            className="ml-1.5 border-l border-custom-grey h-28" 
          />
          <View 
            className="p-3 ml-4 h-24 flex-1 flex-row rounded-2xl bg-custom-dark border-x-2 border-custom-white"
          >
            <TouchableOpacity
              className="flex-1 justify-center"
              onPress={() => navigation.navigate('EditSession', { 
                dayId: item.dayId,
                sessionId: item.sessionId, 
                sessionName: item.sessionName,
                sessionCustom: item.sessionCustom,
                newSession: false,
                phaseId: phaseId 
              })}
              activeOpacity={0.6}
              disabled={isActive}
            >
              <Text className="text-lg text-custom-white font-BaiJamjuree-Bold">
                {item.sessionName}
              </Text>
              <Text className="text-custom-white font-BaiJamjuree-LightItalic">
                {item.totalExercises} {item.totalExercises! !== 1 ? 'exercises': 'exercise'}
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
          className="mr-3 w-3 h-3 rounded border-2"
          style={{
            backgroundColor: bgColor,
            borderColor: bdColor,
          }}
        />
        <Text 
          className="mt-1 font-BaiJamjuree-Regular text-lg"
          style={{ color: bdColor }}
        >
          {item.dayName}
        </Text>
      </View>
    )
  }

  const listHeader = () => {
    return (
      <View className="flex-row items-center">
        <View 
          className="mr-3 w-3 h-3 rounded border-2"
          style={{
            backgroundColor: listData[0]?.type === 'session' ? '#5AABD6' : 'transparent',
            borderColor: listData[0]?.type === 'session' ? '#5AABD6' : '#505050',
          }}
        />
        <Text 
          className="mt-1 font-BaiJamjuree-Regular text-lg"
          style={{ color: listData[0]?.type === 'session' ? '#5AABD6' : '#505050' }}
        >
          Monday
        </Text>
      </View>
    )
  }

  const renderStatusButton = () => {
    if (status === 'upcoming') {
      return (
        <View
          className="mb-8 border-2 border-custom-grey rounded-2xl h-16 flex-row justify-center items-center"
        >
          <Text className="text-custom-grey mr-3 font-BaiJamjuree-Bold">Locked</Text>
          <Icon name="lock-outline" size={24} color="#505050" />
        </View>
      )
    }

    if (status === 'active') {
      return (
        <TouchableOpacity 
          className="mb-8 border-2 border-custom-green rounded-2xl h-16 justify-center items-center"
          onPress={changePhaseStatus}
          activeOpacity={0.6}
        >
          <Text className="text-custom-green mr-3 font-BaiJamjuree-Bold">Complete This Phase</Text>
        </TouchableOpacity>
      )
    }

    if (status === 'completed') {
      return (
        <View 
          className="mb-8 border-2 border-custom-dark-green rounded-2xl h-16 flex-row justify-center items-center"
        >
          <Text className="text-custom-dark-green mr-3 font-BaiJamjuree-Bold">Phase Completed</Text>
          <Icon name="check" size={24} color="#3C592F" />
        </View>
      )
    }
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

  const registerPhase = () => {
    const sessions = listData.filter(item => item.type === 'session')
    if (sessions.length === 0) {
      navigation.navigate('ErrorModal', { 
        title: 'No Sessions Added', 
        message: 'Please add at least one session to this phase.'
      })
      return
    }

    DB.sql(`
      UPDATE phases 
      SET name = ?
      WHERE id = ?;
    `, [name, phaseId],
    () => navigation.pop())
  }

  const onBackPressed = () => {
    if (newPhase) {
      navigation.navigate('DismissModal', { onConfirm: deletePhase })
    } else {
      const sessions = listData.filter(item => item.type === 'session')
      if (sessions.length === 0) {
        navigation.navigate('ErrorModal', { 
          title: 'No Sessions Added', 
          message: 'Please add at least one session to this phase or delete phase.'
        })
        return
      } else {
        navigation.navigate('DismissModal', { onConfirm: () => navigation.pop() })
      }
    }
  }

  const handlePress = () => {
    setIsEditablePhaseName(true)
  }

  useEffect(() => {
    if (isEditablePhaseName && phaseNameInputRef.current) {
      phaseNameInputRef.current?.focus()
    }
  }, [isEditablePhaseName])


  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        onBackPressed()
        return true
      })
    }, [])
  )

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchPhaseData)

    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          style={{ marginLeft: -4, marginRight: 30 }}
          onPress={onBackPressed}
        />      
      ),
      headerRight: () => (
        phaseCustom === 1 ?
          <TouchableOpacity 
            className="flex-row items-start justify-end"
            onPress={() => setIsEditable(prev => !prev)}
          >
            {isEditable ?
              <Icon name="pencil-remove" color="#F5F6F3" size={22} /> 
            : 
              <Icon name="pencil" color="#F5F6F3" size={22} /> 
            }
          </TouchableOpacity>
        : null
      )
    })

    return () => {
      unsubscribeFocus()
    }
  }, [isEditable, listData])

  return (
    <ScreenWrapper>
      <View className="flex-1 px-3 mb-3">
        <View className="pt-3 pb-8 h-fit flex-col justify-between">
          <View className='w-full mb-1 flex-row justify-between items-center'>
            <View className='w-2/3 -mt-1'>
              <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Phase Name:</Text>
            </View>
            {isEditable ?
              <TouchableOpacity 
                className="w-1/3 h-8 flex-row items-start justify-end"
                onPress={handlePress}
              >
                <Icon name="pencil" color="#F5F6F3" size={22} /> 
              </TouchableOpacity>
            : <View className='w-1/3 h-8' />
            }
          </View>
          <TextInput
            ref={phaseNameInputRef}
            onChangeText={setName}
            className="w-[90%] text-custom-white text-xl font-BaiJamjuree-Bold capitalize"
            defaultValue={name}
            selectionColor="#F5F6F3"
            editable={isEditablePhaseName}
            onSubmitEditing={() => setIsEditablePhaseName(false)}
            multiline={true}
            blurOnSubmit={true}
            enterKeyHint="done"
          />
        </View>
        {renderStatusButton()}
        <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Exercises:</Text>
        <View className="flex-1">
          <DraggableFlatList
            data={listData}
            onDragEnd={({ data, from, to }) => updateSessionDay(data, from, to)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            ListHeaderComponent={listHeader}
            fadingEdgeLength={100}
          />
        </View>
      </View>
      {isEditable &&
        <View className="h-16 mb-3">
          <TouchableOpacity className="
            flex-1 border-2 border-custom-white rounded-2xl 
            flex-row justify-center items-center"
            onPress={() => navigation.navigate('SelectDayModal', { phaseId: phaseId })}
            activeOpacity={0.6}
          >
            <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Add New Session</Text>
            <Icon name="plus" size={24} color="#F5F6F3" />
          </TouchableOpacity>
        </View>
      }
      {isEditable &&
        <BottomBarWrapper>
          <TouchableOpacity 
            className="w-[30%] rounded-2xl border-2 border-custom-red flex-row justify-center items-center"
            onPress={() => {
              navigation.navigate('ConfirmModal', {
                text: 'Are you sure you want to delete this phase?',
                onConfirm: deletePhase
              })
            }}
            activeOpacity={0.6}
          >
            <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Delete</Text>
            <Icon name="delete-outline" size={20} color="#F4533E" />
          </TouchableOpacity>
          <View className="w-3" />
          <TouchableOpacity className="
            flex-1 border-2 border-custom-blue
            flex-row items-center justify-center 
            rounded-2xl"
            onPress={registerPhase}
            activeOpacity={0.6}
          >
            <Text className="text text-custom-blue mr-2 font-BaiJamjuree-Bold">
              Confirm Phase
            </Text>
            <Icon name="check" color="#5AABD6" size={22} /> 
          </TouchableOpacity>
        </BottomBarWrapper>
      }
    </ScreenWrapper>
  )
}

export default EditPhaseScreen

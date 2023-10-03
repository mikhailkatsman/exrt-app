import { Text, View, TouchableOpacity } from "react-native"
import { Icon } from "@react-native-material/core"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { type NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import DraggableFlatList, { OpacityDecorator, RenderItemParams } from "react-native-draggable-flatlist"

type Props = NativeStackScreenProps<RootStackParamList, 'EditPhase'>

type ListItem = {
  type: 'weekday' | 'session',
  dayId: number,
  dayName?: string,
  sessionId?: number,
  totalExercises?: number
}

const EditPhaseScreen: React.FC<Props> = ({ navigation, route }) => {
  const phaseId: number = route.params.phaseId

  const [listData, setListData] = useState<ListItem[]>([])

  useEffect(() => {
    DB.sql(`
      SELECT sei.session_id AS sessionId, 
             psi.day_id AS dayId,
             COUNT(sei.exercise_instance_id) AS totalExercises
      FROM phase_session_instances psi
      INNER JOIN session_exercise_instances sei 
      ON psi.session_id = sei.session_id
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
            dayId: item.dayId,
            totalExercises: item.totalExercises,
          })
        } else {
          const dayIndex = dataArray.findIndex(dayItem => dayItem.dayId === item.dayId)

          dataArray.splice(dayIndex + 1, 0, {
            type: 'session',
            sessionId: item.sessionId,
            dayId: item.dayId,
            totalExercises: item.totalExercises,
          })
        }
      }

      setListData(dataArray)
    })
  }, [])

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
            className="p-3 ml-4 h-20 flex-1 flex-row rounded-xl border border-custom-blue bg-custom-dark"
          >
            <TouchableOpacity
              className="flex-1"
              onPress={() => navigation.navigate('EditSession', { 
                sessionExists: true, 
                sessionId: item.sessionId, 
                phaseId: phaseId 
              })}
              activeOpacity={0.6}
              disabled={isActive}
            >
              <Text className="text-custom-white">
                Index: {index}, Day Id: {item.dayId}, Session Id: {item.sessionId}, Total exercises: {item.totalExercises}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-[15%] h-full flex items-end justify-center"
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

    let bdColor: string = '#F5F6F3'
    let bgColor: string = '#F5F6F3'
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

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <Text className="h-[20%] text-custom-white text-lg font-BaiJamjuree-Medium">
          Phase Breakdown:
        </Text>
        <View className="flex-1">
          <View className="flex-row items-center">
            <View 
              className="mr-3 w-3 h-3 rounded border"
              style={{
                backgroundColor: listData[0]?.type === 'session' ? '#F5F6F3' : 'transparent',
                borderColor: listData[0]?.type === 'session' ? '#F5F6F3' : '#505050',
              }}
            />
            <Text 
              className="mt-1 font-BaiJamjuree-Bold text-lg"
              style={{ color: listData[0]?.type === 'session' ? '#F5F6F3' : '#505050' }}
            >
              Monday
            </Text>
          </View>
          <DraggableFlatList
            className="h-fit"
            data={listData}
            onDragEnd={({ data, from, to }) => updateSessionDay(data, from, to)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
      <BottomBarWrapper>
        <TouchableOpacity 
          className="flex-1 border-2 border-custom-blue rounded-xl flex-row justify-center items-center"
          activeOpacity={1}
        >
          <Text className="mr-2 text-custom-blue font-BaiJamjuree-Bold">Add New Session</Text>
          <Icon name="plus" size={24} color="#5AABD6" />
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EditPhaseScreen

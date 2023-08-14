import { ComponentType, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useKeepAwake } from "expo-keep-awake";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";
import TimeLine from "@components/activeSession/TimeLine";
import CurrentActivity from "@components/activeSession/CurrentActivity";

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: ComponentType<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId
  const instanceData: any[] = route.params.instanceData

  const [activities, setActivities] = useState<any[]>([])
  const [currentActivity, setCurrentActivity] = useState<{
    type: string, data: {} | number
  }>({
    type: 'exercise', 
    data: activities[0]
  })
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0)

  useEffect(() => {
      let activityList: any[] = []

      instanceData.forEach((instance: any) => {
        for (let i = 0; i < instance.sets; i ++) {
          activityList.push({ type: 'exercise', data: instance })

          let restDuration

          if (instance.style === 'compound') {
            restDuration = (i === instance.sets - 1) ? 210 : 150
          }

          if (instance.style === 'isolation') {
            restDuration = (i === instance.sets - 1) ? 120 : 90
          }

          activityList.push({ type: 'rest', data: restDuration })
        }
      })

      setActivities(activityList)
      setCurrentActivity(activityList[currentActivityIndex])
  }, [])

  useKeepAwake()

  return (
    <ScreenWrapper>
      <View className="flex-1 my-3">
        <TimeLine 
          instances={activities} 
          currentActivityIndex={currentActivityIndex} 
        />
        <CurrentActivity activity={currentActivity} />
      </View>
      <BottomBarWrapper>
        <TouchableOpacity 
          className="flex-1 flex-row items-center 
          justify-center rounded-xl bg-custom-green"
          onPress={() => {
            setCurrentActivityIndex(currentActivityIndex + 1)
            setCurrentActivity(activities[currentActivityIndex + 1])
          }}
        >
          <Text className="text-xs mr-2 text-custom-white font-BaiJamjuree-Bold">Start Session</Text>
          <Icon name="timer-outline" color="#F5F6F3" size={24} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default ActiveSessionScreen

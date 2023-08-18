import { ComponentType, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useKeepAwake } from "expo-keep-awake";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";
import TimeLine from "@components/activeSession/TimeLine";
import CurrentActivityContainer from "@components/activeSession/CurrentActivityContainer";
import { backgrounds, videoFiles } from "@modules/AssetPaths";

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: ComponentType<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId
  const instanceData: any[] = route.params.instanceData

  const [activities, setActivities] = useState<any[]>([])
  const [currentActivity, setCurrentActivity] = useState<{
    type: string, 
    data: {
      name: string,
      reps: number,
      background: keyof typeof backgrounds,
      video: keyof typeof videoFiles,
      description: string,
      style: string,
      type: string
    } | number
  }>({
    type: 'exercise', 
    data: activities[0]
  })
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0)

  useKeepAwake()

  const switchActivity = () => {
    setCurrentActivityIndex(currentActivityIndex + 1)
    setCurrentActivity(activities[currentActivityIndex + 1])
  }

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

      activityList.pop()

      setActivities(activityList)
      setCurrentActivity(activityList[currentActivityIndex])
  }, [])

  const renderButtons = () => {
    if (currentActivity.type === 'rest') {
      return (
        <TouchableOpacity className="flex-1 flex-row items-center 
          justify-center rounded-xl border-2 border-custom-red"
          onPress={switchActivity}
        >
          <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Skip Rest</Text>
          <Icon name="timer-outline" color="#F4533E" size={24} /> 
        </TouchableOpacity>
      )
    }

    if (currentActivityIndex === activities.length - 1) {
      return ( 
        <TouchableOpacity className="flex-1 flex-row items-center 
          justify-center rounded-xl border-2 border-custom-green"
          onPress={() => {}}
        >
          <Text className="mr-2 text-custom-green font-BaiJamjuree-Bold">Finish Session</Text>
          <Icon name="flag-checkered" color="#74AC5D" size={24} /> 
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity className="flex-1 flex-row items-center 
        justify-center rounded-xl border-2 border-custom-white"
        onPress={switchActivity}
      >
        <Text className="mr-2 text-custom-white font-BaiJamjuree-Bold">Complete</Text>
        <Icon name="dumbbell" color="#F5F6F3" size={24} /> 
      </TouchableOpacity>
    )
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 my-3">
        <TimeLine 
          instances={activities} 
          currentActivityIndex={currentActivityIndex} 
        />
        <CurrentActivityContainer 
          activity={currentActivity} 
          nextActivity={switchActivity}
        />
      </View>
      <BottomBarWrapper>
        {renderButtons()}
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default ActiveSessionScreen

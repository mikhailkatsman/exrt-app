import { useEffect, useState, useRef } from "react"
import { useIsFocused } from "@react-navigation/native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity } from "react-native"
import { Icon } from "@react-native-material/core"
import { useKeepAwake } from "expo-keep-awake"
import DB from "@modules/DB"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import TimeLine from "@components/activeSession/TimeLine"
import CurrentActivityContainer from "@components/activeSession/CurrentActivityContainer"
import TutorialModalContainer from "@components/common/TutorialModalContainer"
import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import Progress from "@components/activeSession/Progress"
import { CopilotStep, useCopilot } from "react-native-copilot"
import TutorialActiveSessionModalContainer from "@components/activeSession/TutorialActiveSessionModalContainer"

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>

const ActiveSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId
  const sessionName: string = route.params.sessionName
  const phaseId: number = route.params.phaseId
  const programId: number = route.params.programId
  const isFirstTimeProp: boolean = route.params.isFirstTime

  const sessionTimeRef = useRef<number>(0)

  const [exerciseInstances, setExerciseInstances] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isActivityFinished, setIsActivityFinished] = useState<boolean>(false)
  const [showActivityTimer, setShowActivityTimer] = useState<boolean>(false)
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0)
  const [currentActivity, setCurrentActivity] = useState<{
    type: string, 
    data: {
      id: number,
      exerciseId: number,
      name: string,
      reps: number,
      background: keyof typeof exerciseBackgrounds,
      video: keyof typeof videoFiles,
      description: string,
      style: string,
      type: string
    } | number
  }>()
  const [copilotActive, setCopilotActive] = useState<boolean>(false)
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false)
  const [tutorialModalActive, setTutorialModalActive] = useState<boolean>(false)
  const [tutorialActiveSessionModalActive, setTutorialActiveSessionModalActive] = 
    useState<boolean>(false)

  const copilot = useCopilot()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFirstTime && !copilotActive) {
      const timeout = setTimeout(() => {
        setCopilotActive(true)
        copilot.start('timeLine')
      }, 400)

      copilot.copilotEvents.on('stop', () => setTutorialActiveSessionModalActive(true))

      return () => {
        clearTimeout(timeout)
        copilot.copilotEvents.off('stop', () => setTutorialActiveSessionModalActive(true))
      }
    }

  }, [copilotActive, copilot, isFirstTime])

  useEffect(() => {
    if (isFirstTimeProp) {
      setTimeout(() => {
        setTutorialModalActive(true)
      }, 400)
    }
  }, [])

  useEffect(() => {
    if (!isFocused && copilotActive) {
      setIsFirstTime(false)
      setCopilotActive(false)
    }
  }, [isFocused])

  useEffect(() => {
    DB.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.id AS exerciseId,
             exercises.name AS name,
             exercises.background AS background,
             exercises.style AS style,
             exercises.video AS video,
             exercises.description AS description,
             exercises.type AS type
      FROM session_exercise_instances
      JOIN exercise_instances
      ON session_exercise_instances.exercise_instance_id = exercise_instances.id
      JOIN exercises
      ON exercise_instances.exercise_id = exercises.id
      WHERE session_exercise_instances.session_id = ?
      ORDER BY instance_order ASC;
    `, [sessionId],
    (_: any, result: any) => {
      const instanceData = result.rows._array.map((row: any) => ({
        id: row.id,
        exerciseId: row.exerciseId,
        name: row.name,
        background: row.background,
        video: row.video,
        style: row.style,
        type: row.type,
        description: row.description,
        sets: row.sets,
        reps: row.reps || null,
        minuteDuration: row.minuteDuration || null,
        secondDuration: row.secondDuration || null,
        totalTimeInSeconds: row.minuteDuration * 60 + row.secondDuration || null,
        weight: row.weight || null
      }))

      let activityList: any[] = []

      setExerciseInstances(instanceData)

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
      setCurrentActivity(activityList[0])
    })
  }, [])

  useKeepAwake()

  const switchActivity = () => {
    setIsActivityFinished(false)
    setCurrentActivityIndex(currentActivityIndex + 1)
    setCurrentActivity(activities[currentActivityIndex + 1])
  }

  const handleTimeChange = (timeValue: number) => {
    sessionTimeRef.current = timeValue
  }

  const finishSession = () => {
    DB.sql(`
      UPDATE sessions
      SET status = 'completed'
      WHERE id = ?;
    `, [sessionId], 
    () => 
      navigation.replace('EndSession', { 
        isFirstTime: isFirstTimeProp ?? false,
        sessionId: sessionId, 
        sessionName: sessionName,
        exerciseIds: exerciseInstances.map(instance => instance.exerciseId), 
        timeTotal: sessionTimeRef.current,
        phaseId: phaseId,
        programId: programId
      })
    )
  }

  const renderButtons = () => {
    const lastInstance: boolean = currentActivityIndex === activities.length - 1

    if (currentActivity?.type === 'rest') {
      return (
        <TouchableOpacity className="flex-1 flex-row items-center 
          justify-center rounded-2xl border-2 border-custom-red"
          onPress={switchActivity}
        >
          <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Skip Rest</Text>
          <Icon name="timer-outline" color="#F4533E" size={24} /> 
        </TouchableOpacity>
      )
    }

    if (currentActivity?.data.totalTimeInSeconds > 0) {
      if (isActivityFinished) {
        return (
          <TouchableOpacity className={`flex-1 flex-row items-center 
            justify-center rounded-2xl border-2 
            ${lastInstance ? 'border-custom-green' : 'border-custom-white'}`}
            onPress={() => {
              if (lastInstance) {
                finishSession()
              } else {
                switchActivity()
              }
            }}
          >
            <Text className={`mr-2 ${lastInstance ? 'text-custom-green' : 'text-custom-white'} font-BaiJamjuree-Bold`}>
              {lastInstance ? 'Finish Session' : 'Complete'}
            </Text>
            {lastInstance ?
              <Icon name="flag-checkered" color="#74AC5D" size={24} /> 
            :
              <Icon name="dumbbell" color="#F5F6F3" size={24} /> 
            }
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity className={`flex-1 flex-row items-center 
            justify-center rounded-2xl border-2 
            ${showActivityTimer ? 'border-custom-dark-grey' : 'border-custom-red'}`}
            onPress={() => setShowActivityTimer(true)}
            disabled={showActivityTimer}
          >
            <Text className={`mr-2 ${showActivityTimer ? 'text-custom-dark-grey' : 'text-custom-red'} font-BaiJamjuree-Bold`}>
              {showActivityTimer ? 'Complete' : 'Start Timer'}
            </Text>
            {showActivityTimer ? 
              <Icon name="dumbbell" color="#252525" size={24} /> 
            :
              <Icon name="timer-outline" color="#F4533E" size={24} /> 
            }
          </TouchableOpacity>
        )
      }
    }

    if (lastInstance) {
      return ( 
        <TouchableOpacity className="flex-1 flex-row items-center 
          justify-center rounded-2xl border-2 border-custom-green"
          onPress={finishSession}
        >
          <Text className="mr-2 text-custom-green font-BaiJamjuree-Bold">Finish Session</Text>
          <Icon name="flag-checkered" color="#74AC5D" size={24} /> 
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity className="flex-1 flex-row items-center 
        justify-center rounded-2xl border-2 border-custom-white"
        onPress={switchActivity}
      >
        <Text className="mr-2 text-custom-white font-BaiJamjuree-Bold">Complete</Text>
        <Icon name="dumbbell" color="#F5F6F3" size={24} /> 
      </TouchableOpacity>
    )
  }

  const CopilotTimeLine = ({copilot}: any) => (
    <View className="absolute w-full h-40 z-0" {...copilot} />
  )

  const CopilotActivityContainer = ({copilot}: any) => (
    <View className="absolute w-full top-40 -bottom-22 z-0" {...copilot} />
  )

  return currentActivity ? (
    <>
      <TutorialModalContainer 
        active={tutorialModalActive}
        text="This is the Active Session Screen!"
        setTutorialModalActive={setTutorialModalActive}
        setIsFirstTime={setIsFirstTime}
      />
      <TutorialActiveSessionModalContainer
        active={tutorialActiveSessionModalActive}
        setTutorialActiveSessionModalActive={setTutorialActiveSessionModalActive}
        finishSession={finishSession}
      />
      <ScreenWrapper>
        <View className="flex-1 mt-5 mb-3">
          {isFirstTimeProp &&
            <CopilotStep order={8} text="This is the timeline to help you keep track of what exercises to complete and for how long to rest" name="timeLine">
              <CopilotTimeLine />
            </CopilotStep>
          }
          {isFirstTimeProp &&
            <CopilotStep order={9} text="This is an activity container that holds all the relevant info about the current exercise" name="activity">
              <CopilotActivityContainer />
            </CopilotStep>
          }
          <Progress
            totalActivities={activities}
            currentActivity={currentActivityIndex}
            setTimeRef={handleTimeChange}
          />
          <TimeLine 
            instances={activities} 
            currentActivityIndex={currentActivityIndex} 
          />
          <CurrentActivityContainer 
            activity={currentActivity} 
            nextActivity={switchActivity}
            setActivityStatus={setIsActivityFinished}
            showActivityTimer={showActivityTimer}
            setShowActivityTimer={setShowActivityTimer}
          />
        </View>
        <BottomBarWrapper>
          {renderButtons()}
        </BottomBarWrapper>
      </ScreenWrapper>
    </>
  ) : (
    <View className="bg-custom-dark flex-1" />
  )
}

export default ActiveSessionScreen

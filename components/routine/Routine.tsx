import { useEffect, useState, useRef } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { 
  Easing, 
  withSequence,
  useAnimatedStyle,
  useSharedValue, 
  withTiming, 
  withDelay 
} from "react-native-reanimated"
import RoutineSlot from "./RoutineSlot"
import { ScrollView } from "react-native-gesture-handler"
import { Icon } from "@react-native-material/core"
import RestDayAnimation from "./RestDayAnimation"
import { CopilotStep } from "react-native-copilot"
import tourTextData from "@modules/TourTextData"

type Props = {
  isFirstTime: boolean | undefined,
  dataArray: any[],
  selectedDay: number, 
  screenWidth: number,
  mondayDate: string,
  locale: string,
}

const Routine: React.FC<Props> = ({ isFirstTime, dataArray, selectedDay, screenWidth, mondayDate, locale }) => {

  const [intState, setIntState] = useState(selectedDay)
  const [sessionsArray, setSessionsArray] = useState<any[]>([])
  const [dateString, setDateString] = useState<string | undefined>('')

  const opacity = useSharedValue(0)
  const translateX = useSharedValue(screenWidth)

  const scrollRef = useRef<ScrollView>(null)
  const elementWidth = (screenWidth / 100 * 70) 

  const animatedStyle = useAnimatedStyle(() => {
    return { 
      opacity: opacity.value, 
      transform: [{ translateX: translateX.value }] 
    }
  })

  function formatDate(selectedDay: number): string | undefined {
    if (mondayDate.length === 0) return undefined

    const date = new Date(mondayDate)

    date.setDate(date.getDate() + selectedDay)

    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0, { duration: 100, easing: Easing.out(Easing.ease) }),
    )

    const timeoutId = setTimeout(() => {
      translateX.value = selectedDay > intState ? screenWidth : - screenWidth

      setIntState(selectedDay)

      opacity.value = withSequence(
        withDelay(50, withTiming(1, { duration: 100, easing: Easing.in(Easing.ease) }))
      )

      translateX.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.exp) })
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [selectedDay])

  useEffect(() => {
    const filteredData: any[] = dataArray
      .filter(data => data.day_id === intState + 1)
      .map(item => {
        const sessions = item.session_ids.split(',')
        const names = item.session_names.split(',')
        const statuses = item.session_statuses.split(',')
        const customs = item.session_customs.split(',')
        const phaseIds = item.phase_ids.split(',')
        const phaseNames = item.phase_names.split(',')
        const programIds = item.program_ids.split(',')
        const programNames = item.program_names.split(',')
        const programThumbnails = item.program_thumbnails.split(',')

        return sessions.map((sessionId: string, index: number) => ({
          id: parseInt(sessionId),
          name: names[index],
          status: statuses[index],
          custom: customs[index],
          phaseId: phaseIds[index],
          phaseName: phaseNames[index],
          programId: programIds[index],
          programName: programNames[index],
          thumbnail: programThumbnails[index]
        }))
      })
      .flat()

    setDateString(formatDate(selectedDay))
    setSessionsArray(filteredData)
  }, [dataArray, intState])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: 0,
      animated: false
    })
  }, [intState])

  const CopilotRoutineCard = ({ copilot }: any) => (
    <View
      {...copilot}
      className="h-full absolute z-0" 
      style={{ width: elementWidth + 16 }} 
    />
  )

  const CopilotStartSessionButton = ({ copilot }: any) => (
    <View
      {...copilot}
      className="h-16 absolute bottom-2 left-6 z-50" 
      style={{ width: elementWidth - 24 }} 
    />
  )

  return (
    <Animated.View style={animatedStyle} className="flex-1 flex-col py-3">
      <View className="h-[10%] mx-2">
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">
          {dateString}
        </Text>
      </View>
      {sessionsArray.length === 0 ? (
        <RestDayAnimation />
      ) : (
        <>
          <ScrollView 
            ref={scrollRef}
            horizontal={true} 
            directionalLockEnabled={true}
            fadingEdgeLength={100}
            disableIntervalMomentum={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate='fast'
            snapToInterval={elementWidth + 16}
            snapToAlignment="center"
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            overScrollMode="never"
            bounces={false}
          >
            {isFirstTime &&
              <CopilotStep text={tourTextData.copilotStepText6} order={6} name="sessionCard">
                <CopilotRoutineCard />
              </CopilotStep>
            }
            {isFirstTime &&
              <CopilotStep text={tourTextData.copilotStepText7} order={7} name="toGetReadyScreen">
                <CopilotStartSessionButton />
              </CopilotStep>
            }
            {sessionsArray.map((session, index) => 
              <RoutineSlot 
                key={index} 
                session={session} 
                routineId={selectedDay + 1}
                elementWidth={elementWidth}
              />
            )}
            <TouchableOpacity
              className="h-full mx-2 overflow-hidden border-x-2 border-custom-white rounded-2xl flex justify-center items-center"
              style={{ width: elementWidth }}
              onPress={() => {}}
              activeOpacity={0.6}
            >
              <Text className="mx-12 mb-6 text-custom-white text-center font-BaiJamjuree-Bold">
                Subscribe to another program and add more sessions
              </Text>
              <Icon name="plus" size={50} color="#F5F6F3" />
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </Animated.View>
  )
}

export default Routine

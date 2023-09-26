import { useEffect, useState } from "react"
import { ImageBackground, Text } from "react-native"
import Animated, { Easing, withSequence, useAnimatedStyle, useSharedValue, withTiming, withDelay } from "react-native-reanimated"
import RoutineSlot from "./RoutineSlot"
import { ScrollView } from "react-native-gesture-handler"

type Props = {
  dataArray: any[],
  selectedDay: number, 
  screenWidth: number,
}

const Routine: React.FC<Props> = ({ dataArray, selectedDay, screenWidth }) => {
  const [intState, setIntState] = useState(selectedDay)
  const [sessionsArray, setSessionsArray] = useState<any[]>([])
  const opacity = useSharedValue(0)
  const translateX = useSharedValue(screenWidth)

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value, transform: [{ translateX: translateX.value }] }
  })

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0, { duration: 150, easing: Easing.out(Easing.ease) }),
    )

    const timeoutId = setTimeout(() => {
      translateX.value = selectedDay > intState ? screenWidth : - screenWidth

      setIntState(selectedDay)

      opacity.value = withSequence(
        withDelay(50, withTiming(1, { duration: 150, easing: Easing.in(Easing.ease) }))
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
        const statuses = item.session_statuses.split(',')
        const phaseNames = item.phase_names.split(',')
        const programNames = item.program_names.split(',')
        const programThumbnails = item.program_thumbnails.split(',')

        return sessions.map((sessionId: string, index: number) => ({
          id: parseInt(sessionId),
          status: statuses[index],
          phase: phaseNames[index],
          program: programNames[index],
          thumbnail: programThumbnails[index]
        }))
      })
      .flat()
    console.log('Filtered data from Routine: ' + JSON.stringify(filteredData, null, 2))

    setSessionsArray(filteredData)
  }, [dataArray, intState])

  return (
    <Animated.View style={animatedStyle} className="flex-1 flex-col p-3">
      {sessionsArray.length === 0 ? (
        <ImageBackground
          source={require('../../assets/images/bg/comet.png')}
          className="flex-1 justify-center items-center"
          resizeMode="stretch"
        >
          <Text className="text-custom-white font-BaiJamjuree-Regular text-4xl">Rest</Text>
        </ImageBackground>
      ) : (
        <ScrollView horizontal={true}>
          {sessionsArray.map((session, index) => 
            <RoutineSlot 
              key={index} 
              session={session} 
              routineId={selectedDay + 1}
              index={index}
              total={sessionsArray.length - 1}
              elementWidth={screenWidth / 3 * 2}
            />
          )}
        </ScrollView>
      )}
    </Animated.View>
  )
}

export default Routine

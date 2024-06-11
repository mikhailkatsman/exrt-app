import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { CopilotStep, useCopilot } from "react-native-copilot"
import DB from '@modules/DB'
import { icons } from "@modules/AssetPaths"
import ScreenWrapper from "@components/common/ScreenWrapper"
import Progress from "@components/home/Progress"
import ActivePrograms from "@components/home/ActivePrograms"
import AnimatedNavigationButton from "@components/home/AnimatedNavigationButton"
import { initNotificationsUpdate } from '@modules/Notifications'
import { Icon } from "@react-native-material/core"
import SplashScreen from "@components/context/SplashScreen"
import { useIsFocused } from "@react-navigation/native"
import TutorialModalContainer from "@components/common/TutorialModalContainer"
import tourTextData from "@modules/TourTextData"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const dimentions = Dimensions.get('screen')
const dateNow: Date = new Date()
const dayNow = (dateNow.getDay() + 6) % 7

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFirstTimeProp = route.params?.isFirstTime ?? false
  const copilotStep = route.params?.copilotStep ?? 'toBrowseProgramsScreen'

  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [dayIds, setDayIds] = useState<number[]>([])
  const [activePrograms, setActivePrograms] = useState<any[]>([])
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false)
  const [copilotActive, setCopilotActive] = useState<boolean>(false)
  const [tutorialModalActive, setTutorialModalActive] = useState<boolean>(false)

  const copilot = useCopilot()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFirstTime && !copilotActive) {
      const timeout = setTimeout(() => {
        setCopilotActive(true)
        copilot.start(copilotStep)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [copilotActive, copilot, isFirstTime])

  useEffect(() => {
    if (isFocused) {
      if (copilotStep !== 'toBrowseProgramsScreen' && isFirstTimeProp) {
        setIsFirstTime(true)
      }
      fetchData()
      initNotificationsUpdate()
    } else if (copilotActive) {
      setIsFirstTime(false)
      setCopilotActive(false)
    }
  }, [isFocused])

  useEffect(() => {
    if (isLoaded && isFirstTimeProp && copilotStep === 'toBrowseProgramsScreen') {
      setTimeout(() => {
        setTutorialModalActive(true)
      }, 400)
    }
  }, [isLoaded])

  const fetchData = () => {
    DB.sql(`
      SELECT DISTINCT psi.day_id
      FROM phase_session_instances psi
      JOIN phases p ON psi.phase_id = p.id
      JOIN program_phases pp ON p.id = pp.phase_id
      JOIN programs pr ON pp.program_id = pr.id
      WHERE pr.status = 'active' AND p.status = 'active';
    `, [],
      (_, result) => {
        const dayIdsData = result.rows._array.map(item => item.day_id)

        DB.sql(`
        SELECT p.id, p.name, p.description,
             p.thumbnail, p.status,
             COUNT(pp.phase_id) AS total_phases,
             COUNT(CASE WHEN ph.status = 'completed' THEN 1 ELSE NULL END) AS completed_phases
      FROM programs p
      LEFT JOIN program_phases pp ON p.id = pp.program_id
      LEFT JOIN phases ph ON pp.phase_id = ph.id
      WHERE p.status = 'active'
      GROUP BY p.id;
    `, [],
          (_, result) => {
            setDayIds(dayIdsData)
            setActivePrograms(result.rows._array)
          })
      })
  }

  const CopilotProgress = ({ copilot }: any) => (
    <View {...copilot} className="w-full h-[106px] mt-12 z-0" />
  )

  const CopilotActivePrograms = ({ copilot }: any) => (
    <View {...copilot} className="w-full flex-1 z-0 border" />
  )

  const CopilotProgramsAnimatedButton = ({ copilot }: any) => (
    <View {...copilot} className="w-full h-1/5 mb-4 z-0" />
  )

  const CopiloExercisesAnimatedButton = ({ copilot }: any) => (
    <View {...copilot} className="w-full h-1/5 mb-4 z-0" />
  )

  return (
    <>
      <SplashScreen isComponentLoaded={isLoaded} />
      <TutorialModalContainer 
        active={tutorialModalActive}
        text={tourTextData.homeScreenModalText}
        setTutorialModalActive={setTutorialModalActive}
        setIsFirstTime={setIsFirstTime}
      />
      <ScreenWrapper>
        <View className="w-full p-2 flex flex-row justify-between items-center">
          <Image
            className="h-6 w-6"
            resizeMode="contain"
            source={icons['Logo' as keyof typeof icons]}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            className="h-10 w-10 flex justify-center items-end"
            activeOpacity={0.6}
          >
            <Icon name="cog" size={22} color="#F5F6F3" />
          </TouchableOpacity>
        </View>
        {isFirstTimeProp && (
          <View className="absolute top-0 left-2 w-full h-full">
            <CopilotStep text={tourTextData.copilotStepText4} order={4} name="toHubScreen">
              <CopilotProgress />
            </CopilotStep>
            <CopilotStep text={tourTextData.copilotStepText3} order={3} name="activePrograms">
              <CopilotActivePrograms />
            </CopilotStep>
            <CopilotStep text={tourTextData.copilotStepText1} order={1} name="toBrowseProgramsScreen">
              <CopilotProgramsAnimatedButton />
            </CopilotStep>
            <CopiloExercisesAnimatedButton />
          </View>
        )}
        <Progress
          dayIds={dayIds}
          dayNow={dayNow}
          screenWidth={dimentions.width}
        />
        <View className="h-4" />
        <ActivePrograms
          activePrograms={activePrograms}
          screenWidth={dimentions.width}
          onLayout={() => setIsLoaded(true)}
        />
        <View className="h-4" />
        <View className="h-1/5">
          <AnimatedNavigationButton
            key={'button1'}
            isOverlayActive={copilotActive || tutorialModalActive}
            image={icons.ProgramsIcon}
            textLine1="Browse"
            textLine2="Programs"
            route="ProgramsList"
            delay={100}
          />
        </View>
        <View className="h-4" />
        <View className="h-1/5">
          <AnimatedNavigationButton
            key={'button2'}
            isOverlayActive={copilotActive || tutorialModalActive}
            image={icons.ExercisesIcon}
            textLine1="Browse"
            textLine2="Exercises"
            route="ExercisesList"
            delay={200}
          />
        </View>
        <View className="h-5" />
      </ScreenWrapper>
    </>
  )
}

export default HomeScreen

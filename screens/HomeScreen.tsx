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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const dimentions = Dimensions.get('screen')
const dateNow: Date = new Date()
const dayNow = (dateNow.getDay() + 6) % 7

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFirstTimeProp = route.params.isFirstTime

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
        copilot.start()
      }, 400)

      return () => clearTimeout(timeout)
    }
  }, [copilotActive, copilot, isFirstTime])

  useEffect(() => {
    if (isFocused) {
      fetchData()
      initNotificationsUpdate()
    } else if (copilotActive) {
      setIsFirstTime(false)
      setCopilotActive(false)
    }
  }, [isFocused])

  useEffect(() => {
    if (isLoaded && isFirstTimeProp) {
      setTimeout(() => {
        setTutorialModalActive(true)
      }, 1000)
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
    <View {...copilot}>
      <Progress
        dayIds={dayIds}
        dayNow={dayNow}
        screenWidth={dimentions.width}
      />
    </View>
  )

  const CopilotActivePrograms = ({ copilot }: any) => (
    <View {...copilot} className="flex-1">
      <ActivePrograms
        activePrograms={activePrograms}
        screenWidth={dimentions.width}
        onLayout={() => setIsLoaded(true)}
      />
    </View>
  )

  const CopilotProgramsAnimatedButton = ({ copilot }: any) => (
    <View {...copilot} className="h-1/5">
      <AnimatedNavigationButton
        key={'button1'}
        isCopilotActive={copilotActive}
        image={icons.ProgramsIcon}
        colorName="custom-purple"
        colorCode="#7D34A7"
        textLine1="Browse"
        textLine2="Programs"
        route="ProgramsList"
        delay={200}
      />
    </View>
  )

  const CopilotExercisesAnimatedButton = ({ copilot }: any) => (
    <View {...copilot} className="h-1/5">
      <AnimatedNavigationButton
        key={'button2'}
        isCopilotActive={copilotActive}
        image={icons.ExercisesIcon}
        colorName="custom-yellow"
        colorCode="#F7EA40"
        textLine1="Browse"
        textLine2="Exercises"
        route="ExercisesList"
        delay={300}
      />
    </View>
  )

  return (
    <>
      <SplashScreen isComponentLoaded={isLoaded} />
      <TutorialModalContainer active={tutorialModalActive}>
        <View className="h-[70%] pb-2 px-6 flex justify-between items-center">
          <Text className='my-3 text-custom-dark font-BaiJamjuree-Regular'>
            This is the home screen.
          </Text>
        </View>
        <View className="h-[30%] w-full p-2">
          <TouchableOpacity
            className="flex-1 justify-center items-center rounded-lg border border-custom-dark"
            onPress={() => {
              setTutorialModalActive(false)
              setIsFirstTime(true)
            }}
          >
            <Text className="text-custom-dark font-BaiJamjuree-Bold">Next</Text>
          </TouchableOpacity>
        </View>
      </TutorialModalContainer>
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
        <CopilotStep text='This is your progress tracker' order={1} name="progress">
          <CopilotProgress />
        </CopilotStep>
        <View className="h-8" />
        <CopilotStep text='These are your active programs' order={2} name="activePrograms">
          <CopilotActivePrograms />
        </CopilotStep>
        <View className="h-4" />
        <CopilotStep text='This is where you view all available programs' order={3} name="programs">
          <CopilotProgramsAnimatedButton />
        </CopilotStep>
        <View className="h-4" />
        <CopilotStep
          text={`This is where you view details about all the exercises.

Click "Continue" to navigate
to programs list.`}
          order={4}
          name="toBrowseProgramsScreen"
        >
          <CopilotExercisesAnimatedButton />
        </CopilotStep>
        <View className="h-5" />
      </ScreenWrapper>
    </>
  )
}

export default HomeScreen

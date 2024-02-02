import { View, Dimensions, Image, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from '@modules/DB'
import { icons } from "@modules/AssetPaths"
import * as SplashScreen from 'expo-splash-screen'
import ScreenWrapper from "@components/common/ScreenWrapper"
import Progress from "@components/home/Progress"
import ActivePrograms from "@components/home/ActivePrograms"
import AnimatedNavigationButton from "@components/home/AnimatedNavigationButton"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { initNotificationsUpdate, updateNotifications } from '@modules/Notifications'
import { Icon } from "@react-native-material/core"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const dimentions = Dimensions.get('screen')
const dateNow: Date = new Date()
const dayNow = (dateNow.getDay() + 6) % 7

SplashScreen.preventAutoHideAsync()

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [dayIds, setDayIds] = useState<number[]>([])
  const [activePrograms, setActivePrograms] = useState<any[]>([])
  const [animationTrigger, setAnimationTrigger] = useState<boolean>(false)

  const splashOpacity = useSharedValue(1)

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

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData()
      initNotificationsUpdate()
      setAnimationTrigger(prev => !prev)
    })

    return () => {
      unsubscribeFocus()
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      splashOpacity.value = withTiming(0, { duration: 500 })
    }
  }, [isLoaded])

  const animatedSplashStyle = useAnimatedStyle(() => {
    return {
      opacity: splashOpacity.value,
      pointerEvents: "none"
    }
  })

  const loadHandler = async() => {
    SplashScreen.hideAsync()  
  }

  return (
    <>
    <Animated.View 
      style={animatedSplashStyle} 
      className="absolute w-full h-full bg-custom-dark z-50 justify-center items-center"
    >
      <Image
        onLoad={loadHandler}
        resizeMode="center"
        className="scale-[1.055]"
        source={icons['SplashLogo' as keyof typeof icons]}
        fadeDuration={0}
      />
    </Animated.View>
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
      <Progress 
        dayIds={dayIds} 
        dayNow={dayNow}
        screenWidth={dimentions.width} 
      />
      <View className="h-8" />
      <ActivePrograms 
        activePrograms={activePrograms}
        screenWidth={dimentions.width}
        onLayout={() => setIsLoaded(true)}
      />
      <View className="h-14" />
      <AnimatedNavigationButton
        key={'button1'}
        trigger={animationTrigger}
        image={icons.ProgramsIcon}
        colorName="custom-purple"
        colorCode="#7D34A7"
        textLine1="Browse"
        textLine2="Programs"
        route="ProgramsList"
        delay={200}
      />
      <View className="h-10" />
      <AnimatedNavigationButton
        key={'button2'}
        trigger={animationTrigger}
        image={icons.ExercisesIcon}
        colorName="custom-yellow"
        colorCode="#F7EA40"
        textLine1="Browse"
        textLine2="Exercises"
        route="ExercisesList"
        delay={300}
      />
      <View className="h-5" />
    </ScreenWrapper>
    </>
  )
}

export default HomeScreen

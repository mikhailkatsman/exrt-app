import { View } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from '@modules/DB'
import { icons } from "@modules/AssetPaths"
import ScreenWrapper from "@components/common/ScreenWrapper"
import Progress from "@components/home/Progress"
import ActivePrograms from "@components/home/ActivePrograms"
import AnimatedNavigationButton from "@components/home/AnimatedNavigationButton"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [dayIds, setDayIds] = useState<number[]>([])
  const [activePrograms, setActivePrograms] = useState<any[]>([])
  const [animationTrigger, setAnimationTrigger] = useState<boolean>(false)

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
        SELECT id, name, status, thumbnail FROM programs
        WHERE status = 'active';
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
      setAnimationTrigger(prev => !prev)
      console.log('FOCUSED')
    })
    return () => { unsubscribeFocus() }
  }, [])

  return (
    <ScreenWrapper>
      <Progress dayIds={dayIds} />
      <ActivePrograms activePrograms={activePrograms} />
      <AnimatedNavigationButton
        key={'button1'}
        trigger={animationTrigger}
        image={icons.ProgramsIcon}
        colorName="custom-purple"
        colorCode="#7D34A7"
        textLine1="Browse"
        textLine2="Programs"
        route="ProgramsList"
        delay={100}
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
        delay={200}
      />
      <View className="h-5" />
    </ScreenWrapper>
  )
}

export default HomeScreen

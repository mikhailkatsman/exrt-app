import { View, Text, Button, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from '@modules/DB'
import ScreenWrapper from "@components/common/ScreenWrapper"
import Progress from "@components/home/Progress"
import ActivePrograms from "@components/home/ActivePrograms"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [dayIds, setDayIds] = useState<number[]>([])
  const [activePrograms, setActivePrograms] = useState<any[]>([])

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
    const unsubscribeFocus = navigation.addListener('focus', fetchData)
    return () => { unsubscribeFocus() }
  }, [])

  return (
    <ScreenWrapper>
      <Progress dayIds={dayIds} />
      <ActivePrograms activePrograms={activePrograms} />
      <TouchableOpacity 
        className="mx-2 mb-7 h-[18%] rounded-xl border border-custom-white justify-center items-center"
        onPress={() => navigation.navigate('ProgramsList')}
        activeOpacity={0.6}
      >
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Browse Programs</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="mx-2 mb-5 h-[18%] rounded-xl border border-custom-white justify-center items-center"
        onPress={() => navigation.navigate('ExerciseList')}
        activeOpacity={0.6}
      >
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Browse Exercises</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  )
}

export default HomeScreen

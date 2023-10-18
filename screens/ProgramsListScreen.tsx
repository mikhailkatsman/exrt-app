import ScreenWrapper from "@components/common/ScreenWrapper"
import { View, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import ProgramCard from "@components/common/ProgramCard"

type Props = NativeStackScreenProps<RootStackParamList, 'ProgramsList'>

const ProgramsListScreen: React.FC<Props> = ({ navigation }) => {
  const [programsList, setProgramsList] = useState<any[]>([])

  const fetchPrograms = () => {
    DB.sql(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.thumbnail,
        p.status,
        COUNT(pp.phase_id) AS total_phases,
        COUNT(CASE WHEN ph.status = 'completed' THEN 1 ELSE NULL END) AS completed_phases
      FROM
        programs p
      LEFT JOIN
        program_phases pp ON p.id = pp.program_id
      LEFT JOIN
        phases ph ON pp.phase_id = ph.id
      GROUP BY
        p.id;
    `, [], 
    (_, result) => {
      const programDetails = result.rows._array.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail,
        status: item.status,
        total_phases: item.total_phases,
        completed_phases: item.completed_phases
      }))

      setProgramsList(programDetails)
    })
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchPrograms)

    return () => {
      unsubscribeFocus()
    }
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <ScrollView className="h-fit w-full">
          {programsList.map((item, index) => (
            <ProgramCard
              key={index} 
              id={item.id}
              name={item.name}
              thumbnail={item.thumbnail}
              status={item.status}
              total_phases={item.total_phases}
              completed_phases={item.completed_phases}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default ProgramsListScreen

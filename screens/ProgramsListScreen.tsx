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
      SELECT * FROM programs
      GROUP BY name;
    `, [], 
    (_, result) => {
      const programDetails = result.rows._array.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail,
        status: item.status,
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
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default ProgramsListScreen

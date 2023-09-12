import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { View, TouchableOpacity, Text, ScrollView } from "react-native"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import ProgramCard from "@components/common/ProgramCard"

type Props = NativeStackScreenProps<RootStackParamList, 'Programs'>

const ProgramsListScreen: React.FC<Props> = ({ navigation }) => {
  const [programsList, setProgramsList] = useState<any[]>([])

  useEffect(() => {
    DB.sql(`
      SELECT * FROM programs;
    `, [], 
    (_, result) => {
      const programDetails: any[] = []
      result.rows._array.forEach(item => {
        programDetails.push({
          id: item.id,
          name: item.name,
          description: item.description,
          thumbnail: item.thumbnail,
          status: item.status,
        })
      })

      setProgramsList(programDetails)
    })

    
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

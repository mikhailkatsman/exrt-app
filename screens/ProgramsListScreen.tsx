import ScreenWrapper from "@components/common/ScreenWrapper"
import { View, ScrollView, Text, TouchableOpacity } from "react-native"
import { Icon } from "@react-native-material/core"
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
      <View className="h-28 mx-3 mb-5">
        <TouchableOpacity 
          className="w-full h-1/2 mb-3 p-2 rounded-2xl border-2 border-custom-white justify-end flex-row items-center"
          onPress={() => {}}
          activeOpacity={1}
        >
					<Icon name="magnify" size={30} color="#F5F6F3" />
        </TouchableOpacity>
        <View className="h-1/2">

        </View>
      </View>
      <View className="flex-1 mb-3">
        <ScrollView 
          className="h-fit w-full"
          fadingEdgeLength={200}
        >
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

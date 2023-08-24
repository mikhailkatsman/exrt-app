import BottomBarWrapper from "@components/common/BottomBarWrapper"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { View, TouchableOpacity, Text, ScrollView } from "react-native"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"

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
            <TouchableOpacity 
              key={index} 
              className="h-16 w-16 p-3 border-2 border-custom-white"
              onPress={() => navigation.navigate('EditProgram', {programId: item.id})}
            >
              <Text className="text-custom-white">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <BottomBarWrapper>
        <TouchableOpacity className="
          flex-1 border-2 border-custom-blue
          flex-row items-center justify-center 
          rounded-xl"
          onPress={() => {}}
        >
          <Text className="text text-custom-blue mr-2 font-BaiJamjuree-Bold">
            Whatever
          </Text>
          <Icon name="check" color="#5AABD6" size={22} /> 
        </TouchableOpacity>

      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default ProgramsListScreen

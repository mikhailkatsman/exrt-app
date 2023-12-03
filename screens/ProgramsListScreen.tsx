import ScreenWrapper from "@components/common/ScreenWrapper"
import { View, ScrollView, Text, TextInput } from "react-native"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import ProgramCard from "@components/common/ProgramCard"
import DropDown from "@components/common/Dropdown"

type Props = NativeStackScreenProps<RootStackParamList, 'ProgramsList'>

const ProgramsListScreen: React.FC<Props> = ({ navigation }) => {
  const [programsList, setProgramsList] = useState<any[]>([])
  const [searchString, setSearchString] = useState<string | null>(null)
  const [typeSort, setTypeSort] = useState<string | null>(null)
  const [statusSort, setStatusSort] = useState<string | null>(null)

  const programTypeList: { label: string, value: string }[] = [

  ]
  const programStatusList: { label: string, value: string}[] = [

  ]

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
    
  }, [searchString, typeSort, statusSort])

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchPrograms)

    return () => {
      unsubscribeFocus()
    }
  }, [])

  return (
    <ScreenWrapper>
      <View className="mx-2 h-14 p-2 rounded-2xl border-2 border-custom-white flex justify-between flex-row items-center">
        <TextInput 
          className="px-2 flex-1 h-full text-custom-white text-lg font-BaiJamjuree-Bold"
          enterKeyHint="search"
          maxLength={25}
          selectionColor="#F5F6F3"
          onChangeText={setSearchString}
        />
        <Icon name="magnify" size={30} color="#F5F6F3" />
      </View>
      <View className="flex-1 mb-3 overflow-hidden">
        <View className="w-full flex-col">
          <View className="h-[15%] p-2 flex-row items-center justify-between">
            <Text className="text-custom-white mb-1 font-BaiJamjuree-Regular">Sort by</Text>
            <DropDown 
              placeholder='Type'
              listItems={programTypeList}
              onIndexChange={(index: number) => setTypeSort(programTypeList[index].value)}
              reset={() => setTypeSort(null)}
            />
            <DropDown 
              placeholder='Status' 
              listItems={programStatusList} 
              onIndexChange={(index: number) => setStatusSort(programStatusList[index].value)}
              reset={() => setStatusSort(null)}
            />
          </View>
          <ScrollView 
            className="h-[85%] p-2 bg-custom-dark"
            horizontal={false}
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
      </View>
    </ScreenWrapper>
  )
}

export default ProgramsListScreen

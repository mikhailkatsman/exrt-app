import ScreenWrapper from "@components/common/ScreenWrapper"
import { View, ScrollView, Text, TextInput } from "react-native"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import ProgramCard from "@components/common/ProgramCard"
import DropDown from "@components/common/Dropdown"
import { CopilotStep, useCopilot } from "react-native-copilot"

type Props = NativeStackScreenProps<RootStackParamList, 'ProgramsList'>

const ProgramsListScreen: React.FC<Props> = ({ navigation, route }) => {
  const continueTour: boolean | undefined = route.params?.continueTour

  const [programsList, setProgramsList] = useState<any[]>([])
  const [searchString, setSearchString] = useState<string | null>(null)
  const [typeSort, setTypeSort] = useState<string | null>(null)
  const [difficultySort, setDifficultySort] = useState<string | null>(null)
  const [copilotStarted, setCopilotStarted] = useState(false)

  const copilot = useCopilot()

  const programTypeList: { label: string, value: string }[] = [
    { label: 'Hypertrophy', value: 'hypertrophy' },
    { label: 'Strength', value: 'strength' },
    { label: 'Skills', value: 'skills' },
    { label: 'Mobility', value: 'mobility' },
  ]
  const programDifficultyList: { label: string, value: number }[] = [
    { label: 'Beginner', value: 1 },
    { label: 'Intermediate', value: 2 },
    { label: 'Expert', value: 3 },
  ]

  useEffect(() => {
    if (continueTour && !copilotStarted) {
      const timeout = setTimeout(() => {
        console.log('STARTING COPILOT ON A NEW SCREEN')
        copilot.start()
        copilot.goToNext()
        setCopilotStarted(true)
      }, 600)

      return () => clearTimeout(timeout)
    } 
  }, [copilot, copilotStarted])

  const fetchPrograms = (searchString: string | null, typeSort: string | null, difficultySort: string | null) => {
    let sqlQuery = `SELECT * FROM programs`

    let parameters = []

    if (searchString) {
      sqlQuery += ' WHERE name LIKE ?'
      parameters.push(`%${searchString}%`)
    }

    if (typeSort) {
      sqlQuery += searchString ? ' AND' : ' WHERE'
      sqlQuery += ' type = ?'
      parameters.push(typeSort)
    }

    if (difficultySort) {
      sqlQuery += searchString || typeSort ? ' AND' : ' WHERE'
      sqlQuery += ' difficulty = ?'
      parameters.push(difficultySort)
    }

    sqlQuery += ' ORDER BY name;'

    parameters = parameters.filter(param => param !== undefined || param !== null)


    DB.sql(
      sqlQuery,
      parameters,
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
    fetchPrograms(searchString, typeSort, difficultySort)
  }, [searchString, typeSort, difficultySort])

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => fetchPrograms(searchString, typeSort, difficultySort))

    return () => {
      unsubscribeFocus()
    }
  }, [])

  const CopilotFilters = ({ copilot }: any) => (
    <View {...copilot}>
      <Text className="px-2 mb-1 text-custom-grey font-BaiJamjuree-Regular">Sort by</Text>
      <View className="px-2 mb-3 flex-row justify-between">
        <DropDown 
          placeholder='Type'
          listItems={programTypeList}
          onIndexChange={(index: number) => setTypeSort(programTypeList[index].value)}
          reset={() => setTypeSort(null)}
        />
        <View className="w-2"/>
        <DropDown 
          placeholder='Difficulty' 
          listItems={programDifficultyList} 
          onIndexChange={(index: number) => setDifficultySort(programDifficultyList[index].value)}
          reset={() => setDifficultySort(null)}
        />
      </View>
    </View>
  )

  return (
    <ScreenWrapper>
      <View className="mx-2 h-14 mb-3 p-2 rounded-2xl border-2 border-custom-white flex justify-between flex-row items-center">
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
        <CopilotStep text="These are the program list filters" order={5} name="filters">
          <CopilotFilters />
        </CopilotStep>
        <ScrollView 
          className="h-[85%] mt-3 p-2 bg-custom-dark"
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
    </ScreenWrapper>
  )
}

export default ProgramsListScreen

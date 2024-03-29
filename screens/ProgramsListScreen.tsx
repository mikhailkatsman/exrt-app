import ScreenWrapper from "@components/common/ScreenWrapper"
import { TouchableOpacity, ScrollView, View, Text, TextInput } from "react-native"
import { Icon } from "@react-native-material/core"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { useEffect, useState } from "react"
import DB from "@modules/DB"
import ProgramCard from "@components/common/ProgramCard"
import DropDown from "@components/common/Dropdown"
import { CopilotStep, useCopilot } from "react-native-copilot"
import { useIsFocused } from "@react-navigation/native"
import TutorialModalContainer from "@components/common/TutorialModalContainer"

type Props = NativeStackScreenProps<RootStackParamList, 'ProgramsList'>

const ProgramsListScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFirstTimeProp: boolean | undefined = route.params?.isFirstTime

  const [programsList, setProgramsList] = useState<any[]>([])
  const [searchString, setSearchString] = useState<string | null>(null)
  const [typeSort, setTypeSort] = useState<string | null>(null)
  const [difficultySort, setDifficultySort] = useState<string | null>(null)
  const [copilotActive, setCopilotActive] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false)
  const [tutorialModalActive, setTutorialModalActive] = useState<boolean>(false)

  const copilot = useCopilot()
  const isFocused = useIsFocused()

  const programTypeList: { label: string, value: string }[] = [
    { label: 'Hypertrophy', value: 'hypertrophy' },
    { label: 'Strength', value: 'strength' },
    { label: 'Skills', value: 'skills' },
    { label: 'Mobility', value: 'mobility' },
  ]

  const programDifficultyList: { label: string, value: string }[] = [
    { label: 'Beginner', value: '1' },
    { label: 'Intermediate', value: '2' },
    { label: 'Expert', value: '3' },
  ]

  useEffect(() => {
    if (isFirstTime && !copilotActive) {
      const timeout = setTimeout(() => {
        setCopilotActive(true)
        copilot.start('toHomeScreenThenHub')
      }, 400)

      return () => clearTimeout(timeout)
    }
  }, [copilotActive, copilot, isFirstTime])


  useEffect(() => {
    if (isFocused) {
      fetchPrograms(searchString, typeSort, difficultySort)
    } else if (copilotActive) {
      setIsFirstTime(false)
      setCopilotActive(false)
    }
  }, [isFocused, searchString, typeSort, difficultySort])

  useEffect(() => {
    if (isFirstTimeProp) {
      setTimeout(() => {
        setTutorialModalActive(true)
      }, 600)
    }
  }, [])

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

    sqlQuery += ' AND id != ?'
    parameters.push(1)

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

  const CopilotProgramCard = ({ copilot }: any) => (
    <View {...copilot}>
      <ProgramCard
        id={1}
        name='Your First Exercise Program'
        thumbnail='tutorial_program_thumbnail'
      />
    </View>
  )

  return (
    <>
      <TutorialModalContainer active={tutorialModalActive}>
        <View className="h-[70%] pb-2 px-6 flex justify-between items-center">
          <Text className='my-3 text-custom-dark font-BaiJamjuree-Regular'>
            This is the Programs List screen.
          </Text>
        </View>
        <View className="h-[30%] w-full p-2">
          <TouchableOpacity
            className="flex-1 justify-center items-center rounded-lg border border-custom-dark"
            onPress={() => {
              setTutorialModalActive(false)
              setIsFirstTime(true)
            }}
          >
            <Text className="text-custom-dark font-BaiJamjuree-Bold">Next</Text>
          </TouchableOpacity>
        </View>
      </TutorialModalContainer>
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
        <Text className="px-2 mb-1 text-custom-grey font-BaiJamjuree-Regular">Sort by</Text>
        <View className="px-2 mb-3 flex-row justify-between">
          <DropDown
            placeholder='Type'
            listItems={programTypeList}
            onIndexChange={(index: number) => setTypeSort(programTypeList[index].value)}
            reset={() => setTypeSort(null)}
          />
          <View className="w-2" />
          <DropDown
            placeholder='Difficulty'
            listItems={programDifficultyList}
            onIndexChange={(index: number) => setDifficultySort(programDifficultyList[index].value)}
            reset={() => setDifficultySort(null)}
          />
        </View>
        <View className="flex-1 mb-3 overflow-hidden">
          <ScrollView
            className="p-2 bg-custom-dark"
            horizontal={false}
            fadingEdgeLength={200}
          >
            {isFirstTime &&
              <CopilotStep
                text="Let's subscribe to this example program."
                order={2}
                name="toHomeScreenThenHub"
                key={0}
              >
                <CopilotProgramCard />
              </CopilotStep>
            }
            {programsList.map((item, index) => (
              <ProgramCard
                key={index + 1}
                id={item.id}
                name={item.name}
                thumbnail={item.thumbnail}
                status={item.status}
              />
            ))}
          </ScrollView>
        </View>
      </ScreenWrapper>
    </>
  )
}

export default ProgramsListScreen

import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { ComponentType, useEffect, useState, useContext } from "react"
import SelectDropdown from 'react-native-select-dropdown'
import ScrollPickerGrid from "@components/actions/ScrollPickerGrid"
import ExerciseCard from "@components/common/ExerciseCard"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import DB from "@modules/DB"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "@react-native-material/core"

type Props = NativeStackScreenProps<RootStackParamList, 'NewInstance'>

const NewInstanceScreen: ComponentType<Props> = ({ navigation }) => {
  const [exerciseList, setExerciseList] = useState<{
    id: number, 
    name: string, 
    thumbnail: string 
  }[]>([])
  const muscleGroupList: string[] = [
    'chest', 'biceps', 'triceps', 'abs', 'traps', 'forearms',
    'lats', 'delts', 'glutes', 'quads', 'calves'
  ]
  const exerciseTypeList: string[] = ['bodyweight', 'equipment', 'free weight']
  const [groupSortValue, setGroupSortValue] = useState<string>('')
  const [typeSortValue, setTypeSortValue] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  
  useEffect(() => {
    DB.sql(`
      SELECT id, name, thumbnail
      FROM exercises
      ORDER BY name
      LIMIT 20;
      `, [],
      (_, result) => setExerciseList(result.rows._array)
    ) 
  }, [])

  return (
    <View className="h-full w-full px-2 bg-custom-dark">
      <ScrollPickerGrid />
      <View
        className="
          w-full h-[63%] mb-4 flex-row overflow-hidden
          justify-between
        "
      >
        <View className="w-full flex-col">
          <View className="h-[15%] p-2 flex-row items-center justify-between">
            <Text className="text-custom-white mb-1 font-bold">Sort by</Text>
            <View className="border border-custom-white rounded-lg mr-1">
              <SelectDropdown 
                data={muscleGroupList.map(item => item[0].toUpperCase() + item.slice(1))}
                defaultButtonText="Muscle Group"
                onSelect={selectedItem => setGroupSortValue(selectedItem)}
                buttonStyle={{ width: 130, height: 35, backgroundColor: 'transparent', }}
                buttonTextStyle={{ color: '#F5F6F3', fontSize: 12 }}
                renderDropdownIcon={() => (
                  <Icon name="arrow-down-right" size={20} color="#F5F6F3" />
                )}
                dropdownStyle={{
                  maxHeight: 250,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderRadius: 10, 
                  borderStyle: 'solid', 
                  borderWidth: 1, 
                  borderColor: '#F5F6F3', 
                  backgroundColor: '#080B06' 
                }}
                rowStyle={{ height: 45 }}
                rowTextStyle={{ color: '#F5F6F3', fontSize: 14 }}
              />
            </View>
            <View className="border border-custom-white rounded-lg">
              <SelectDropdown 
                data={exerciseTypeList.map(item => item[0].toUpperCase() + item.slice(1))}
                defaultButtonText="Type"
                onSelect={selectedItem => setTypeSortValue(selectedItem)}
                buttonStyle={{ width: 130, height: 35, backgroundColor: 'transparent' }}
                buttonTextStyle={{ color: '#F5F6F3', fontSize: 12 }}
                renderDropdownIcon={() => (
                  <Icon name="arrow-down-right" size={20} color="#F5F6F3" />
                )}
                dropdownStyle={{
                  maxHeight: 270,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderRadius: 10, 
                  borderStyle: 'solid', 
                  borderWidth: 1, 
                  borderColor: '#F5F6F3', 
                  backgroundColor: '#080B06' 
                }}
                rowStyle={{ height: 45 }}
                rowTextStyle={{ color: '#F5F6F3', fontSize: 14 }}
              />
            </View>
          </View>
          <ScrollView 
            className="h-[85%] p-2 bg-custom-dark"
            horizontal={false}
          >
            <View className="h-6" />
            {exerciseList.map((exercise, index) => (
              <ExerciseCard 
                key={index}
                id={exercise.id}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                name={exercise.name}
                thumbnail={exercise.thumbnail}
              />
            ))}
            <View className="h-6" />
          </ScrollView>
          <LinearGradient colors={['#080B06', '#080B0600']} className="absolute top-16 left-0 right-0 h-10" />
          <LinearGradient colors={['#080B0600', '#080B06']} className="absolute bottom-0 left-0 right-0 h-10" />
        </View>
      </View>
      <TouchableOpacity 
        className="w-full h-[8%] bg-custom-blue rounded-xl flex justify-center items-center"
        onPress={() => navigation.pop()}
      >
      <Text className="text-custom-white font-bold text-lg">Add Instance</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NewInstanceScreen

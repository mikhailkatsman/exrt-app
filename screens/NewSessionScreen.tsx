import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from '../App'
import { ComponentType } from "react"
import { Icon } from "@react-native-material/core"

type Props = NativeStackScreenProps<RootStackParamList, 'NewSession'>

const NewSessionsScreen: ComponentType<Props> = ({ navigation, route }) => {
  return (
    <View className="h-full w-full p-2 bg-custom-dark">
      <View
        className="
          w-full h-[90%] mb-4 flex-row overflow-hidden
          justify-between rounded-xl
          border border-custom-white
        "
      >
        <View className="w-full flex-col">
          <Text className="m-2 text-custom-white text-lg">Upcoming Session</Text>
          <View className="mx-2 border-b border-custom-white" />
          <ScrollView 
            className="p-2 rounded-xl bg-custom-dark"
            horizontal={false}
          >
            
            <TouchableOpacity className="
              w-full h-12 mb-2 
              border border-custom-white rounded-lg 
              flex justify-center items-center"
              onPress={() => navigation.navigate("NewInstance")}
            >
              <Icon name="plus" size={30} color="#F5F6F3" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity 
        className="w-full h-[8%] bg-custom-blue rounded-xl flex justify-center items-center"
      >
        <Text className="text-custom-white font-bold text-lg">Add Session to Routine</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NewSessionsScreen

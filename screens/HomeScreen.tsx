import { View, Text, Button } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import ScreenWrapper from "@components/common/ScreenWrapper"

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <View className="mx-2 mb-5 h-[15%] bg-custom-yellow">
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Continue Your Progress:</Text>
        <Button title="Continue Your Progress" onPress={() => navigation.navigate('Hub')} />
      </View>
      <View className="mx-2 mb-5 flex-1 bg-custom-yellow">
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Your Active Programs:</Text>
        <Button title="Browse Programs" onPress={() => navigation.navigate('Programs')} />
      </View>
      <View className="mx-2 mb-5 flex-1 bg-custom-yellow">
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Browse Programs:</Text>
        <Button title="Create a New Program" onPress={() => navigation.navigate('SetProgramNameModal')} />
      </View>
      <View className="mx-2 mb-5 flex-1 bg-custom-yellow">
        <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Browse Exercises:</Text>
        <Button title="Create a New Program" onPress={() => navigation.navigate('SetProgramNameModal')} />
      </View>
    </ScreenWrapper>
  )
}

export default HomeScreen

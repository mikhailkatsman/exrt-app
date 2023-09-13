import { Text, View, TouchableOpacity, ImageBackground, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { programThumbnails } from "@modules/AssetPaths"
import { LinearGradient } from "expo-linear-gradient"

type Props = {
  id: number,
  name: string,
  thumbnail: string,
  status: string,
}

const windowWidth = Dimensions.get('window').width - 16

const ProgramCard: React.FC<Props> = ({
  id,
  name,
  thumbnail,
  status
}) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      className="w-full mb-4 rounded-xl overflow-hidden"
      style={{ height: (windowWidth * 9) / 16 }}
      onPress={() => navigation.navigate('EditProgram', {programId: id})}
      activeOpacity={0.5}
    >
      <ImageBackground
        className="flex-1"
        resizeMode="center"
        source={
          programThumbnails[thumbnail as keyof typeof programThumbnails] || 
          {uri: thumbnail}
        }
      >
        <LinearGradient 
          className="absolute h-full w-full"
          colors={['rgba(0,0,0,0.7)', 'transparent']}
        />
        <View className="flex-1 p-3">
          <Text className="text-custom-white text-xl font-BaiJamjuree-Bold">
            {name}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default ProgramCard

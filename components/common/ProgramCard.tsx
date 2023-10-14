import { Text, View, TouchableOpacity, ImageBackground, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { programThumbnails } from "@modules/AssetPaths"
import { LinearGradient } from "expo-linear-gradient"

type Props = {
  id: number,
  name: string,
  thumbnail: string,
  status: string,
  total_phases: number,
  completed_phases: number,
}

const windowWidth = Dimensions.get('window').width - 16

const ProgramCard: React.FC<Props> = ({
  id,
  name,
  thumbnail,
  status,
  total_phases,
  completed_phases
}) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      className="w-full mb-4 rounded-xl overflow-hidden"
      style={{ height: (windowWidth * 9) / 16 }}
      onPress={() => navigation.navigate('EditProgram', { programId: id })}
      activeOpacity={0.5}
    >
      <ImageBackground
        className="flex-1 flex-col justify-between"
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
        <View className="h-[60%] p-3">
          <Text className="text-custom-white text-xl font-BaiJamjuree-Bold">
            {name}
          </Text>
        </View>
        <View className="flex-row h-[35%]">
          <View className="flex-1 p-3">
            <View className="flex-1 flex-row bg-2/3-transparent rounded-lg overflow-hidden">
              <View className="absolute z-10 w-full h-full justify-center items-center">
                <Text className="text-custom-white text-xs font-BaiJamjuree-Bold">
                  Progress: {((completed_phases / total_phases) * 100).toFixed(0)}%
                </Text>
              </View>
              {Array.from({ length: total_phases }).map((_, index) => (
                <View
                  key={index}
                  className={`flex-1 ${index + 1 <= completed_phases && 'bg-custom-grey'}`} 
                />
              ))}

            </View>
          </View>
          <TouchableOpacity
            className="w-[40%] py-3 pr-3"
            onPress={() => {
              navigation.navigate('ChangeProgramStatusModal', {
                status: status,
                programId: id
              })
            }}
            activeOpacity={0.6}
          >
            <View className={`flex-1 justify-center items-center bg-2/3-transparent rounded-lg border 
              ${status === 'active' ? 'border-custom-red' : 'border-custom-green'}
            `}>
              <Text className={`font-BaiJamjuree-Bold ${status === 'active' ? 'text-custom-red' : 'text-custom-green'}`}>
                {status === 'active' ? 'Unsubscribe' : 'Subscribe'}
              </Text>

            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default ProgramCard

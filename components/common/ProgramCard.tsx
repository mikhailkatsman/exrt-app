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

  let statusProps = {
    statusText: '',
    statusTextColor: '#F5F6F3',
    buttonText: 'Subscribe',
    buttonTextColor: '#74AC5D',
    buttonBorderColor: '#74AC5D',
  }

  if (status === 'active') {
    statusProps = {
      statusText: status,
      statusTextColor: '#F5F6F3',
      buttonText: 'Unsubscribe',
      buttonTextColor: '#F4533E',
      buttonBorderColor: '#F4533E',
    }
  } else if (status === 'completed') {
    statusProps = {
      statusText: status,
      statusTextColor: '#74AC5D',
      buttonText: 'Retry',
      buttonTextColor: '#74AC5D',
      buttonBorderColor: '#74AC5D',
    }
  }

  return (
    <TouchableOpacity
      className="w-full mb-5 rounded-2xl border-x-2 border-custom-white overflow-hidden"
      style={{ height: (windowWidth * 9) / 16 }}
      onPress={() => navigation.navigate('EditProgram', { programId: id, newProgram: false })}
      activeOpacity={0.5}
    >
      <ImageBackground
        className="flex-1 flex-col justify-between"
        resizeMode="cover"
        source={
          programThumbnails[thumbnail as keyof typeof programThumbnails] || 
          {uri: thumbnail}
        }
      >
        <LinearGradient 
          className="absolute h-full w-full"
          colors={['rgba(18, 18, 18, 1)', 'transparent']}
          // start={{ x: 0.3, y: 0 }}
          // end={{ x: 0.7, y: 1 }}
        />
        <View className="h-[60%] p-3">
          <Text className="text-custom-white text-xl font-BaiJamjuree-Bold capitalize">
            {name}
          </Text>
          <Text className="font-BaiJamjuree-RegularItalic capitalize" style={{ color: statusProps.statusTextColor }}>
            {statusProps.statusText}
          </Text>
        </View>
        <View className="flex-row h-[35%]">
          <View className="flex-1 p-3" />
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
            <View className="flex-1 justify-center items-center bg-twothird-transparent rounded-xl border"
                  style={{ borderColor: statusProps.buttonBorderColor }}
            >
              <Text className="font-BaiJamjuree-Bold" style={{ color: statusProps.buttonTextColor }}>
                {statusProps.buttonText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default ProgramCard

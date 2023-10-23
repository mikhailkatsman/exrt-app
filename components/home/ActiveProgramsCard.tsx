import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { programThumbnails } from '@modules/AssetPaths'

type Props = {
	width: number,
	id: number,
	name: string,
	thumbnail: string,
	status: string,
	totalPhases: number,
	completedPhases: number
}


const ActiveProgramsCard: React.FC<Props> = ({
	width,
	id,
	name,
	thumbnail,
	status,
	totalPhases,
	completedPhases
}) => {
	const navigation = useNavigation()

	return (
		<TouchableOpacity 
			className='mr-4 rounded-2xl overflow-hidden border-x-2 border-custom-white'
			style={{ width: width }}
			onPress={() => navigation.navigate('EditProgram', { programId: id })}
			activeOpacity={0.6}
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
          colors={['rgba(0,0,0,1)', 'transparent']}
	  start={{ x: 0, y: 0 }}
	  end={{ x: 0.8, y: 1 }}
        />
        <View className="flex-1 p-3">
          <Text className="text-custom-white text-xl font-BaiJamjuree-Bold">
            {name}
          </Text>
        </View>
				<View className="h-[28%] pb-3 px-3">
					<View className="flex-1 flex-row bg-twothird-transparent rounded-xl overflow-hidden">
						<View className="absolute z-10 w-full h-full justify-center items-center">
							<Text className="text-custom-white text-xs font-BaiJamjuree-Bold">
								Progress: {((completedPhases / totalPhases) * 100).toFixed(0)}%
							</Text>
						</View>
						{Array.from({ length: totalPhases }).map((_, index) => (
							<View
								key={index}
								className={`flex-1 ${index + 1 <= completedPhases && 'bg-custom-grey'}`} 
							/>
						))}

					</View>
				</View>
      </ImageBackground>
		</TouchableOpacity>
	)
}

export default ActiveProgramsCard

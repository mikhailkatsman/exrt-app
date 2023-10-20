import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

type Props = {
	dayIds: number[],
	screenWidth: number,
}

const Progress: React.FC<Props> = ({ dayIds, screenWidth }) => {
	const navigation = useNavigation()

	return (
		<TouchableOpacity 
			className="mx-2 h-[13%]"
			onPress={() => navigation.navigate('Hub', { screenWidth: screenWidth })}
			activeOpacity={0.6}
		>
			<Text className="mb-3 text-custom-white font-BaiJamjuree-BoldItalic">Continue Your Progress</Text>
			<View className='flex-1 border border-custom-white rounded-2xl'>

			</View>
		</TouchableOpacity>
	)
}

export default Progress

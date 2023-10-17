import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

type Props = {
	dayIds: number[],
}

const Progress: React.FC<Props> = ({ dayIds }) => {
	console.log('Progress data: ' + dayIds)

	const navigation = useNavigation()

	return (
		<TouchableOpacity 
			className="mx-2 mb-7 h-[18%]"
			onPress={() => navigation.navigate('Hub')}
			activeOpacity={0.6}
		>
			<Text className="text-custom-white font-BaiJamjuree-MediumItalic">Continue Your Progress:</Text>
		</TouchableOpacity>
	)
}

export default Progress

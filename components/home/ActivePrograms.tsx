import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
	activePrograms: any[],
}

const ActivePrograms: React.FC<Props> = ({ activePrograms }) => {
	console.log('Active Programs data: ' + JSON.stringify(activePrograms, null, 2))

	const navigation = useNavigation()

	return (
		<ScrollView 
			className="mx-2 mb-7 flex-1"
		>
			<Text className="text-custom-white font-BaiJamjuree-MediumItalic">Your Active Programs:</Text>
		</ScrollView>
	)
}

export default ActivePrograms 

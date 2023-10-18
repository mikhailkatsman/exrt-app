import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, Text, View, Image } from 'react-native'

type Props = {
	image: string,
	color: string,
	textLine1: string,
	textLine2: string,
	route: string,
	params: { [key: string]: string | number | boolean } | undefined,
}

const AnimatedNavigationButton: React.FC<Props> = ({ 
	image, 
	color, 
	textLine1, 
	textLine2, 
	route, 
	params }) => {
	const colorValues = {
		border: `border-${color}`,
		bg: `bg-${color}`
	}
	const navigation = useNavigation()

	return (
		<TouchableOpacity 
			className={`mx-2 mb-7 h-[18%] rounded-2xl border
				flex-row items-center
				${colorValues.border}
			`}
			onPress={() => navigation.navigate(route, params)}
			activeOpacity={0.6}
		>
			<Image
				source={require("@icons/ProgramsIcon.png")}
				className="w-1/2 h-full" 
			/>
			<View className="w-1/2">
				<Text className="text-custom-white text-2xl font-BaiJamjuree-BoldItalic">{textLine1}</Text>
				<Text className="text-custom-white text-2xl font-BaiJamjuree-BoldItalic">{textLine2}</Text>
			</View>
		</TouchableOpacity>
	)
}

export default AnimatedNavigationButton

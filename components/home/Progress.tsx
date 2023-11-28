import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

type Props = {
	dayIds: number[],
	dayNow: number,
	screenWidth: number,
}

const Progress: React.FC<Props> = ({ dayIds, dayNow, screenWidth }) => {
  const week: string[] = ["M", "T", "W", "T", "F", "S", "S"]

	const navigation = useNavigation()

	return (
		<TouchableOpacity 
			className="px-2 h-[16%] w-full"
			onPress={() => navigation.navigate('Hub', { dayNow: dayNow, screenWidth: screenWidth })}
			activeOpacity={0.6}
		>
			<Text className="mb-3 text-custom-white font-BaiJamjuree-BoldItalic">Continue Your Progress</Text>
			<View className='flex-1 flex-row justify-around'>
				{week.map((item, index) => (
					<View 
						key={index}
						className='h-full flex-col items-center'
					>
						<Text 
							className={`mt-2 mb-3 text-xs font-BaiJamjuree-Bold 
							${index === dayNow ? 'text-custom-red' : 'text-custom-white'}`}
						>
							{item}
						</Text>
						{dayIds.includes(index + 1) && <View className='mb-3 border-2 w-2 flex-1 border-custom-white rounded' />}
					</View>
				))}
			</View>
		</TouchableOpacity>
	)
}

export default Progress

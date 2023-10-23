import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from "@react-native-material/core"
import { useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import ActiveProgramsCard from './ActiveProgramsCard'
import { useNavigation } from '@react-navigation/native'

type Props = {
	activePrograms: any[],
	screenWidth: number,
}


const ActivePrograms: React.FC<Props> = ({ activePrograms, screenWidth }) => {
	const elementWidth = useMemo(() => {
		return screenWidth * 70 / 100
	}, [screenWidth])

	const navigation = useNavigation()

	return (
		<View className='flex-1'>
			<Text className="mb-3 mx-2 text-custom-white font-BaiJamjuree-BoldItalic">Your Active Programs</Text>
			<ScrollView 
				className="flex-1 -mx-2"
				horizontal={true}
				disableIntervalMomentum={true}
				showsHorizontalScrollIndicator={false}
				decelerationRate='fast'
				snapToInterval={elementWidth + 20}
				snapToAlignment='center'
				contentContainerStyle={{ paddingHorizontal: 16 }}
				fadingEdgeLength={100}
				alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
				overScrollMode="never"
				bounces={false}
			>
				{activePrograms.map((item, index) => (
					<ActiveProgramsCard
						key={index}
						width={elementWidth}
						id={item.id}
						name={item.name}
						thumbnail={item.thumbnail}
						status={item.status}
						totalPhases={item.total_phases}
						completedPhases={item.completed_phases}
					/>
				))}
				<TouchableOpacity
					className="h-full overflow-hidden border-x-2 border-custom-white rounded-2xl flex justify-center items-center"
					style={{ width: elementWidth, backgroundColor: 'rgba(80, 80, 80, 0.2)' }}
					onPress={() => navigation.navigate('SetProgramNameModal')}
					activeOpacity={0.6}
				>
					<Text className='text-custom-white font-BaiJamjuree-Bold'>Add Program</Text>
					<Icon name="plus" size={30} color="#F5F6F3" />
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}

export default ActivePrograms 

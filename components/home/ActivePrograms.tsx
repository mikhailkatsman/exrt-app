import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from "@react-native-material/core"
import { useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import ActiveProgramsCard from './ActiveProgramsCard'
import { useNavigation } from '@react-navigation/native'

type Props = {
	activePrograms: any[],
	screenWidth: number,
	onLayout: () => void
}


const ActivePrograms: React.FC<Props> = ({ activePrograms, screenWidth, onLayout }) => {
	const elementWidth = useMemo(() => {
		return screenWidth * 70 / 100
	}, [screenWidth])

	const navigation = useNavigation()

	return (
		<View className='flex-1' onLayout={onLayout}>
			<View className='mb-3 mx-2 h-8 flex-row justify-between items-center'>
				<Text className="text-custom-white font-BaiJamjuree-BoldItalic">Your Active Programs</Text>
				<TouchableOpacity 
					className='w-[20%] h-8 items-end'
					onPress={() => navigation.navigate('SetProgramNameModal')}
				>
					<Icon name="plus" size={26} color="#F5F6F3" />
				</TouchableOpacity>
			</View>
			<ScrollView 
				className="-mx-2"
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
					style={{ width: elementWidth }}
					onPress={() => navigation.navigate('ProgramsList')}
					activeOpacity={0.6}
				>
					<Text className='text-custom-white font-BaiJamjuree-Bold w-28 text-center mb-4'>Subscribe to New Program</Text>
					<Icon name="plus" size={30} color="#F5F6F3" />
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}

export default ActivePrograms 

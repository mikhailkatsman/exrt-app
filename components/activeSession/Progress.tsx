import { Text, View } from "react-native"

type Props = {
	totalActivities: any[],
	currentActivity: number,
	timeString: string
}

const Progress: React.FC<Props> = ({ totalActivities, currentActivity, timeString }) => {
	return (
		<View className="w-full mb-3 flex-col items-center">
			<Text className="text-custom-white font-BaiJamjuree-Bold mb-1">
				{timeString}
			</Text>	
			<View className="w-full rounded-lg overflow-hidden flex-row items-center">
				{totalActivities.map((_, index) => (
					<View 
						key={index} 
						className=
							{`flex-1 ${index < currentActivity ? 'bg-custom-green h-0.5' : index === currentActivity ? 'bg-custom-red h-1.5 rounded-xl' : 'bg-custom-grey h-0.5'}`} 
					/>
				))}
			</View>
		</View>
	)
}

export default Progress

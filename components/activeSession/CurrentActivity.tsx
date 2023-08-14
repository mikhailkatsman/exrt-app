import { Text, View } from "react-native"

type Props = {
	activity: { type: string, data: {} | number }
}

const CurrentActivity: React.FC<Props> = ({ activity }) => {

	return (
		<View className="flex-1 p-3">
			{activity.type === 'exercise' ? 
				<Text className="text-custom-white">
					{JSON.stringify(activity.data, null, 2)}
				</Text>
				:
				<Text className="text-custom-white">
					Rest for {activity.data.toString()}s
				</Text>
			}
		</View>
	)
}

export default CurrentActivity 

import { useEffect } from "react"
import { Text, View } from "react-native"

type Props = {
	activity: { type: string, data: {} | null }
}

const CurrentActivity: React.FC<Props> = ({ activity }) => {

	return (
		<View className="flex-1 p-3 rounded-xl border border-custom-red">
			<Text className="text-custom-white">{activity.type}</Text>
			<Text className="text-custom-white">{JSON.stringify(activity.data, null, 2)}</Text>
		</View>
	)
}

export default CurrentActivity 

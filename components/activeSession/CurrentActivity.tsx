import { View } from "react-native"

type Props = {
	activity: { type: string, data: number }
}

const CurrentActivity: React.FC<Props> = ({ activity }) => {
	return (
		<View className="flex-1 rounded-xl border border-custom-red">

		</View>
	)
}

export default CurrentActivity 

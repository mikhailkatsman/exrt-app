import { Text, View } from "react-native"

type Props = {
	sessionId: number,
}

const TimeLine: React.FC<Props> = ({ sessionId }) => {
	return (
		<View className="h-36 mb-3 border border-custom-grey">
			<Text className="text-custom-white">
				Session Id: {sessionId}
			</Text>
		</View>
	)
}

export default TimeLine

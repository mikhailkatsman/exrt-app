import { Text } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

type Props = {
	duration: number,
}

const CurrentRest: React.FC<Props> = ({ duration }) => {
	return (
		<Animated.View entering={FadeIn} exiting={FadeOut}>
			<Text className="text-custom-white">{duration.toString()}</Text>
		</Animated.View>
	)
}

export default CurrentRest

import { Text, View } from "react-native"
import { useState, useEffect } from 'react'
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import RemainingTimeIndicator from "./RemainingTimeIndicator"

type Props = {
	duration: number,
	endRest: () => void
}

const CurrentRest: React.FC<Props> = ({ duration, endRest }) => {
	const [seconds, setSeconds] = useState<number>(duration)

	useEffect(() => {
		if (seconds === 0) {
			endRest()
			return
		}
		const timerId = setTimeout(() => {
			setSeconds(prev => prev - 1)
		}, 1000)

		return () => clearTimeout(timerId)
	}, [seconds])

	return (
		<Animated.View
			className="flex-1 justify-center items-center"
			entering={FadeIn} 
			exiting={FadeOut}
		>
			<RemainingTimeIndicator 
				duration={duration}
				remainingSeconds={seconds} 
			/>
			<Text className={`absolute top-[44%]
				text-8xl font-BaiJamjuree-Light
				${seconds > 10 ? 'text-custom-white' : 'text-custom-red'}
			`}
			>
				{seconds.toString()}
			</Text>
		</Animated.View>
	)
}

export default CurrentRest

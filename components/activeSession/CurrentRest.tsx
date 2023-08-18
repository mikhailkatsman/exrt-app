import { Text, View, TouchableOpacity } from "react-native"
import { useState, useEffect } from 'react'
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import RemainingTimeIndicator from "./RemainingTimeIndicator"

type Props = {
	duration: number,
	endRest: () => void
}

const CurrentRest: React.FC<Props> = ({ duration, endRest }) => {
	const [total, setTotal] = useState<number>(duration)
	const [remaining, setRemaining] = useState<number>(duration)

	useEffect(() => {
		if (remaining <= 0) {
			endRest()
			return
		}
		const timerId = setTimeout(() => {
			setRemaining(prev => prev - 1)
		}, 1000)

		return () => clearTimeout(timerId)
	}, [remaining])

	return (
		<Animated.View
			className="flex-1"
			entering={FadeIn} 
			exiting={FadeOut}
		>
			<View className="flex-1 justify-center items-center">
				<RemainingTimeIndicator 
					totalSeconds={total}
					remainingSeconds={remaining} 
				/>
				<Text className={`absolute top-[43%]
					text-8xl font-BaiJamjuree-Light
					${remaining> 10 ? 'text-custom-white' : 'text-custom-red'}
				`}
				>
					{remaining.toString()}
				</Text>
			</View>
			<View className="h-16 w-full flex-row">
				<TouchableOpacity className="flex-1 items-center 
					justify-center rounded-xl border-2 border-custom-white"
					onPress={() => {
						setTotal(prev => prev <= 10 ? 0 : prev - 10)
						setRemaining(prev => prev <= 10 ? 0 : prev - 10)
					}}
				>
					<Text className="text-custom-white mt-1 text-lg font-BaiJamjuree-Bold">
						- 10"
					</Text>
				</TouchableOpacity>
        <View className="w-3" />
				<TouchableOpacity className="flex-1 items-center 
					justify-center rounded-xl border-2 border-custom-white"
					onPress={() => {
						setTotal(prev => prev + 10)
						setRemaining(prev => prev + 10)
					}}
				>
					<Text className="text-custom-white mt-1 text-lg font-BaiJamjuree-Bold">
						+ 10"
					</Text>
				</TouchableOpacity>

			</View>
		</Animated.View>
	)
}

export default CurrentRest

import { Text, View, TouchableOpacity } from "react-native"
import { useState, useEffect } from 'react'
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import RemainingTimeIndicator from "./RemainingTimeIndicator"
import { Audio } from "expo-av"
import { audioFiles } from "@modules/AssetPaths"
import { unloadAsync } from "expo-font"

type Props = {
	duration: number,
	endRest: () => void
}

const CurrentRest: React.FC<Props> = ({ duration, endRest }) => {
	const [total, setTotal] = useState<number>(duration)
	const [remaining, setRemaining] = useState<number>(duration)

	const [countdownSound, setCountdownSound] = useState<Audio.Sound>()

	const playLowSound = async() => {
		const { sound } = await Audio.Sound.createAsync(audioFiles.low_beep)
		setCountdownSound(sound)
		await sound.playAsync()
	}

	const playHighSound = async() => {
		const { sound } = await Audio.Sound.createAsync(audioFiles.high_beep)
		setCountdownSound(sound)
		await sound.playAsync()
	}

	useEffect(() => {
		if ( remaining <= 3 && remaining > 0) {
			playLowSound()
		}

		if (remaining <= 0) {
			playHighSound()
			endRest()
			return
		}
		const timerId = setTimeout(() => {
			setRemaining(prev => prev - 1)
		}, 1000)

		return () => {
			clearTimeout(timerId)
			countdownSound ? countdownSound.unloadAsync() : undefined
		}
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

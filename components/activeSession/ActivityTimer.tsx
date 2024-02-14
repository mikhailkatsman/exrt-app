import { Text, View, TouchableOpacity } from "react-native"
import { useState, useEffect } from 'react'
import RemainingTimeIndicator from "./RemainingTimeIndicator"
import { Audio } from "expo-av"
import { audioFiles } from "@modules/AssetPaths"

type Props = {
	duration: number,
	endTimer: () => void,
}

const ActivityTimer: React.FC<Props> = ({ duration, endTimer }) => {
	const [total, setTotal] = useState<number>(5)
	const [remaining, setRemaining] = useState<number>(5)
	const [isPrep, setIsPrep] = useState<boolean>(true)

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
			if (isPrep) {
				setIsPrep(false)
				setTotal(duration)
				setRemaining(duration)
				return
			} else {
				endTimer()
				return
			}
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
		<View className="flex-1">
			<View className="flex-1 justify-center items-center">
				<Text className={`mb-6 text-5xl font-BaiJamjuree-Regular
					${remaining> 10 ? 'text-custom-white' : 'text-custom-red'}
				`}
				>
					{isPrep ? 'Get Ready!' : 'GO!'}
				</Text>
				<RemainingTimeIndicator 
					totalSeconds={total}
					remainingSeconds={remaining} 
				/>
				<Text className={`absolute top-[50%]
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
		</View>
	)
}

export default ActivityTimer

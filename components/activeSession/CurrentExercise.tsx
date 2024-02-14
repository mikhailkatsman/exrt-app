import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import { LinearGradient } from "expo-linear-gradient"
import { Image, Text, View, TouchableOpacity } from "react-native"
import Animated, { Easing, FadeOut, useSharedValue, withTiming, withDelay, useAnimatedStyle } from "react-native-reanimated"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import ActivityTimer from "./ActivityTimer"

type Props = {
	name: string,
	background: keyof typeof exerciseBackgrounds,
	video: keyof typeof videoFiles,
	style: string,
	totalTimeInSeconds: number,
	screenWidth: number,
	setActivityStatus: (status: boolean) => void,
	showTimer: boolean,
	setShowTimer: (value: boolean) => void,
}

const CurrentExercise: React.FC<Props> = ({
	name,
	background,
	video,
	style,
	totalTimeInSeconds,
	screenWidth,
	setActivityStatus,
	showTimer,
	setShowTimer
}) => {
	const opacity = useSharedValue(0)
	const translateX = useSharedValue(screenWidth)

	const navigation = useNavigation()

	useEffect(() => {
		opacity.value = withDelay(50, withTiming(1, { duration: 150, easing: Easing.in(Easing.ease) }))

		translateX.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.exp) })
	}, [])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: translateX.value }],
		}
	})

	return (
		<Animated.View style={animatedStyle} exiting={FadeOut} className="w-full h-full">
			{showTimer ? (
				<ActivityTimer 
					duration={totalTimeInSeconds} 
					endTimer={() => {
						setActivityStatus(true)
						setShowTimer(false)
					}}
				/>
			) : (
				<>
					<Image
						className="absolute h-full w-full top-0 rounded-2xl"
						resizeMode="cover"
						source={exerciseBackgrounds[background]} 
					/>
					<LinearGradient 
						className="absolute h-full w-full top-0"
						colors={['transparent', 'transparent', '#121212']}
					/>
					<View className="p-4 flex-1">
						<View className="flex-row justify-between">
							<View className="w-[80%]">
								<Text className="text-custom-white font-BaiJamjuree-Bold text-4xl capitalize">
									{name}
								</Text>
								<Text className="text-custom-white font-BaiJamjuree-RegularItalic text-lg">
									{style}
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => navigation.navigate('FullScreenVideo', { videoSource: video })}
							>
								<Icon name="video-outline" size={40} color="#F5F6F3" />
							</TouchableOpacity>
						</View>
					</View>
				</>
			)}
		</Animated.View>
	)
}

export default CurrentExercise

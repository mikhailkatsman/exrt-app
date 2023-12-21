import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import { LinearGradient } from "expo-linear-gradient"
import { Image, Text, View, TouchableOpacity } from "react-native"
import Animated, { Easing, FadeOut, useSharedValue, withTiming, withDelay, useAnimatedStyle } from "react-native-reanimated"
import { Video, ResizeMode } from 'expo-av'
import { useState, useEffect } from "react"

type Props = {
	name: string,
	reps: number,
	minuteDuration: number,
	secondDuration: number,
	background: keyof typeof exerciseBackgrounds,
	video: keyof typeof videoFiles,
	description: string,
	style: string,
	type: string,
	screenWidth: number
}

const CurrentExercise: React.FC<Props> = ({
	name,
	reps,
	minuteDuration,
	secondDuration,
	background,
	video,
	description,
	style,
	type,
	screenWidth
}) => {
	const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false)

	const opacity = useSharedValue(0)
	const translateX = useSharedValue(screenWidth)

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
			{isPlayingVideo ? 
				<Video 
					className="absolute h-full w-full top-0 rounded-2xl"
					source={videoFiles[video]}
					resizeMode={"cover" as ResizeMode}
					isMuted={true}
					shouldPlay={true}
					isLooping={true}
					
				/>
			: 
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
				</> 
			}
			<View className="p-4 h-full flex-col justify-between">
				<View className="flex-row justify-between">
					<View className="w-[80%]">
						<Text className="text-custom-white font-BaiJamjuree-Bold text-4xl">
							{name}
						</Text>
						<Text className="text-custom-white font-BaiJamjuree-RegularItalic text-lg">
							{style}
						</Text>
					</View>
					{isPlayingVideo ? 
						<TouchableOpacity
							onPress={() => setIsPlayingVideo(false)}
						>
							<Icon name="close" size={40} color="#F5F6F3" />
						</TouchableOpacity>
					:
						<TouchableOpacity
							onPress={() => setIsPlayingVideo(true)}
						>
							<Icon name="video-outline" size={40} color="#F5F6F3" />
						</TouchableOpacity>
					}
				</View>
				<View>
					<Text className="text-custom-white">
						Description: {description}
					</Text>
					<Text className="text-custom-white">
						Type: {type}
					</Text>
				</View>
			</View>
		</Animated.View>
	)
}

export default CurrentExercise

import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import { LinearGradient } from "expo-linear-gradient"
import { Image, Text, View, TouchableOpacity } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { Video, ResizeMode } from 'expo-av'
import { useState } from "react"

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
}) => {
	const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false)
	return (
		<Animated.View entering={FadeIn} exiting={FadeOut} className="w-full h-full">
			{isPlayingVideo ? 
				<Video 
					className="absolute h-full w-full top-0 rounded-xl"
					source={videoFiles[video]}
					resizeMode={"cover" as ResizeMode}
					isMuted={true}
					shouldPlay={true}
					isLooping={true}
					
				/>
			: 
				<>
					<Image
						className="absolute h-full w-full top-0 rounded-xl"
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

import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import { LinearGradient } from "expo-linear-gradient"
import { ImageBackground, Text, View, TouchableOpacity, ScrollView } from "react-native"
import Animated, { Easing, useSharedValue, withTiming, withDelay, useAnimatedStyle } from "react-native-reanimated"
import { useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import ActivityTimer from "./ActivityTimer"

type Props = {
	exerciseId: number,
	name: string,
	background: keyof typeof exerciseBackgrounds,
	video: keyof typeof videoFiles,
	style: string,
	execution: string[],
	totalTimeInSeconds: number,
	screenWidth: number,
	setActivityStatus: (status: boolean) => void,
	showTimer: boolean,
	setShowTimer: (value: boolean) => void,
}

const CurrentExercise: React.FC<Props> = ({
	exerciseId,
	name,
	background,
	video,
	style,
	execution,
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
		<Animated.View style={animatedStyle} className="w-full h-full">
			{showTimer ? (
				<ActivityTimer 
					duration={totalTimeInSeconds} 
					endTimer={() => {
						setActivityStatus(true)
						setShowTimer(false)
					}}
				/>
			) : (
				<View className="h-full w-full rounded-2xl overflow-hidden">
					<ImageBackground
						className="flex-1"
						resizeMode="cover"
						source={exerciseBackgrounds[background] || { uri: background }} 
					>
						<View className="flex-1">
							<View className="px-4 pt-4 flex-row justify-between">
								<View className="flex-1">
									<Text className="text-custom-white font-BaiJamjuree-Bold text-3xl uppercase">
										{name}
									</Text>
									<Text className="text-custom-white font-BaiJamjuree-RegularItalic text-lg capitalize">
										{style}
									</Text>
								</View>
								<View>
									<TouchableOpacity
										className="mb-3"
										onPress={() => navigation.navigate('FullScreenVideo', { videoSource: video })}
									>
										<Icon name="video-outline" size={40} color="#F5F6F3" />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => navigation.navigate('ExerciseDetails', {
												exerciseId: exerciseId,
												fromActiveSession: true
										})}
									>
										<Icon name="information-outline" size={40} color="#F5F6F3" />
									</TouchableOpacity>
								</View>
							</View>
							<ScrollView
								className="z-10 absolute top-40 w-full bottom-0"
								showsVerticalScrollIndicator={false}
								bounces={false}
								alwaysBounceVertical={false}
								fadingEdgeLength={100}
							>
								<View className="h-28 w-full" />
								<LinearGradient 
									className="h-36 w-full"
									colors={['transparent', 'transparent', '#121212']}
								/>
								<View className='px-4 pb-3 bg-custom-dark w-full'>
									<Text className="text-custom-white font-BaiJamjuree-MediumItalic">Step By Step:</Text>
								</View>
								{execution.map((paragraph, index) => (
									<View key={index} className="w-full flex flex-row pb-3 px-4 bg-custom-dark border">
										<Text className="w-[10%] pt-0.5 text-custom-red font-BaiJamjuree-Bold text-lg">{index + 1}</Text>
										<Text className="w-[80%] text-custom-white font-BaiJamjuree-Regular">{paragraph}</Text>
									</View>
								))}
							</ScrollView>
							<View className="absolute w-full bottom-0 bg-custom-dark h-20 z-0" />
						</View>
					</ImageBackground>
				</View>
			)}
		</Animated.View>
	)
}

export default CurrentExercise

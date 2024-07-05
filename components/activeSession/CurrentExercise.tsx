import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import { ImageBackground, Text, View, TouchableOpacity } from "react-native"
import Animated, { Easing, useSharedValue, withTiming, withDelay, useAnimatedScrollHandler, useAnimatedStyle } from "react-native-reanimated"
import { useEffect, useState } from "react"
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
	const [parentHeight, setParentHeight] = useState(0);
	const topViewHeightPercentage = 75;
	const topViewMinHeightPercentage = 25;

	const topViewHeight = useSharedValue(0)
	const scrollY = useSharedValue(0)

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

	const topViewAnimatedStyle = useAnimatedStyle(() => {
		const minHeight = parentHeight * (topViewMinHeightPercentage / 100);
		const height = Math.max(
			minHeight,
			parentHeight * (topViewHeightPercentage / 100) - scrollY.value
		);
		return { height: withTiming(height, { duration: 50, easing: Easing.linear }) };
	});

	const handleScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const handleParentLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setParentHeight(height);
		topViewHeight.value = height * (topViewHeightPercentage / 100);
	};

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
				<View className="flex-1" onLayout={handleParentLayout}>
					<Animated.View 
						className="rounded-2xl overflow-hidden"
						style={topViewAnimatedStyle}
					>
						<ImageBackground
							className="flex-1"
							resizeMode="cover"
							source={exerciseBackgrounds[background] || { uri: background }} 
						>
							<View className="flex-1">
								<View className="px-4 pt-4 flex-row justify-between">
									<View className="flex-1 mr-5">
										<Text className="text-custom-white font-BaiJamjuree-Bold text-3xl capitalize">
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
											<Icon name="video-outline" size={36} color="#F5F6F3" />
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => navigation.navigate('ExerciseDetails', {
													exerciseId: exerciseId,
													fromActiveSession: true
											})}
										>
											<Icon name="information-outline" size={34} color="#F5F6F3" />
										</TouchableOpacity>
									</View>
								</View>
								
							</View>
						</ImageBackground>
					</Animated.View>
					<Animated.ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						bounces={false}
						alwaysBounceVertical={false}
						fadingEdgeLength={100}
						onScroll={handleScroll}
						scrollEventThrottle={16}
					>
						<View className='p-4'>
							<Text className="text-custom-white font-BaiJamjuree-MediumItalic">Step By Step:</Text>
						</View>
						{execution.map((paragraph, index) => (
							<View key={index} className="flex flex-row pb-3 px-4">
								<Text className="w-[10%] pt-0.5 text-custom-red font-BaiJamjuree-Bold text-lg">{index + 1}</Text>
								<Text className="w-[80%] text-custom-white font-BaiJamjuree-Regular">{paragraph}</Text>
							</View>
						))}
					</Animated.ScrollView>
				</View>
			)}
		</Animated.View>
	)
}

export default CurrentExercise

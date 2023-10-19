import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, Text, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

type Props = {
	trigger: boolean,
	image: number,
	colorName: string,
	colorCode: string,
	textLine1: string,
	textLine2: string,
	route: string,
	params?: { [key: string]: string | number | boolean } | undefined,
	delay?: number
}

const AnimatedNavigationButton: React.FC<Props> = ({ 
	trigger,
	image, 
	colorName,
	colorCode,
	textLine1, 
	textLine2, 
	route, 
	params,
	delay }) => {
	const colorValues = {
		border: `border-${colorName}`,
		bg: `bg-${colorCode}`,
		code: colorCode
	}
	const navigation = useNavigation()

	const imageTranslateX = useSharedValue(-100)
	const imageOpacity = useSharedValue(0)
	const textTranslateX = useSharedValue(-50)
	const textOpacity = useSharedValue(0)

	function pause(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const animationSequence = async() => {
		await pause(delay || 0)

		imageTranslateX.value = withTiming(0, {
			duration: 250,
			easing: Easing.out(Easing.exp)
		})
		imageOpacity.value = withTiming(1, {
			duration: 150,
			easing: Easing.out(Easing.exp)
		})

		await pause(100)

		textTranslateX.value = withTiming(0, {
			duration: 250,
			easing: Easing.out(Easing.exp)
		})
		textOpacity.value = withTiming(1, {
			duration: 150,
			easing: Easing.out(Easing.exp)
		})
	}

	useEffect(() => {
		imageTranslateX.value = -100
		imageOpacity.value = 0
		textTranslateX.value = -50
		textOpacity.value = 0

		animationSequence()
	}, [trigger])

	const animatedImageStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: imageTranslateX.value }],
			opacity: imageOpacity.value
		}
	})

	const animatedTextStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: textTranslateX.value }],
			opacity: textOpacity.value
		}
	})

	return (
		<TouchableOpacity 
			className="mx-2 h-[18%]"
			onPress={() => navigation.navigate(route, params)}
			activeOpacity={0.6}
		>
			<Animated.Image
				className="absolute mb-2 ml-1 bottom-0 w-1/2 h-[110%] z-10" 
				style={animatedImageStyle}
				resizeMode='contain'
				source={image}
			/>
			<View
				className={`w-full h-full rounded-2xl border
					flex-row items-center overflow-hidden
					${colorValues.border}
				`}
			>
				<LinearGradient 
					className='absolute h-full w-full'
					colors={[colorValues.code, 'transparent']}
					start={{ x: 0, y: 0.6 }}
					end={{ x: 0.3, y: 0 }}
				/>
				<View className='w-1/2' />
				<Animated.View className="w-1/2" style={animatedTextStyle}>
					<Text className="text-custom-white text-2xl font-BaiJamjuree-BoldItalic">{textLine1}</Text>
					<Text className="text-custom-white text-2xl font-BaiJamjuree-BoldItalic">{textLine2}</Text>
				</Animated.View>
			</View>
			
		</TouchableOpacity>
	)
}

export default AnimatedNavigationButton

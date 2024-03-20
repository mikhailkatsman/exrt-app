import { hideAsync } from 'expo-splash-screen'
import { Image } from "react-native"
import { icons } from "@modules/AssetPaths"
import Animated, {
	useAnimatedStyle, 
	useSharedValue, 
	withTiming 
} from "react-native-reanimated"

type Props = {
	isComponentLoaded: boolean,
}

const SplashScreen: React.FC<Props> = ({ isComponentLoaded }) => {
  const splashOpacity = useSharedValue(1)

  const animatedSplashStyle = useAnimatedStyle(() => {
    return {
      opacity: splashOpacity.value,
      pointerEvents: "none"
    }
  })

  const loadHandler = async() => {
    hideAsync()  
  }

	if (isComponentLoaded) {
		splashOpacity.value = withTiming(0, { duration: 500 })
	}

	return (
		<Animated.View 
			style={animatedSplashStyle} 
			className="absolute w-full h-full bg-custom-dark z-50 justify-center items-center"
		>
			<Image
				onLoad={loadHandler}
				resizeMode="center"
				className="scale-[1.055]"
				source={icons['SplashLogo' as keyof typeof icons]}
				fadeDuration={0}
			/>
		</Animated.View>
	)
}

export default SplashScreen

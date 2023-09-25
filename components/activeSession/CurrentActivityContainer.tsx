import { Dimensions, View } from "react-native"
import CurrentExercise from "./CurrentExercise"
import CurrentRest from "./CurrentRest"
import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"

type Props = {
	activity: { 
		type: string, 
		data: {
			name: string,
			reps: number,
			background: keyof typeof exerciseBackgrounds,
			video: keyof typeof videoFiles,
			description: string,
			style: string,
			type: string,
		} | number 
	},
	nextActivity: () => void
}

const screenWidth = Dimensions.get('screen').width

const CurrentActivityContainer: React.FC<Props> = ({ activity, nextActivity }) => {

	return (
		<View className="flex-1 rounded-xl object-contain">
			{activity.type === 'exercise' ? 
				<CurrentExercise 
					name={activity.data?.name}
					reps={activity.data?.reps}
					minuteDuration={activity.data?.minuteDuration ?? null}
					secondDuration={activity.data?.secondDuration ?? null}
					background={activity.data?.background}
					video={activity.data?.video}
					description={activity.data?.description}
					style={activity.data?.style}
					type={activity.data?.type}
					screenWidth={screenWidth}
				/>
			:
				<CurrentRest 
					duration={activity.data as number} 
					endRest={nextActivity}
					screenWidth={screenWidth}
				/>
			}
		</View>
	)
}

export default CurrentActivityContainer 

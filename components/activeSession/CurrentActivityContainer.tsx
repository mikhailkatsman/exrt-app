import { Dimensions, View } from "react-native"
import CurrentExercise from "./CurrentExercise"
import CurrentRest from "./CurrentRest"
import { exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"

type Props = {
	activity: { 
		type: string, 
		data: {
			name: string,
			style: string,
			totalTimeInSeconds: number,
			background: keyof typeof exerciseBackgrounds,
			video: keyof typeof videoFiles,
		} | number 
	},
	nextActivity: () => void,
	setActivityStatus: (status: boolean) => void,
	showActivityTimer: boolean,
	setShowActivityTimer: (value: boolean) => void
}

const screenWidth = Dimensions.get('screen').width

const CurrentActivityContainer: React.FC<Props> = ({
	activity, 
	nextActivity, 
	setActivityStatus,
	showActivityTimer,
	setShowActivityTimer
}) => {
	return (
		<View className="flex-1 rounded-xl object-contain">
			{activity.type === 'exercise' ? 
				<CurrentExercise 
					name={activity.data?.name}
					style={activity.data?.style}
					totalTimeInSeconds={activity.data?.totalTimeInSeconds}
					background={activity.data?.background}
					video={activity.data?.video}
					screenWidth={screenWidth}
					setActivityStatus={setActivityStatus}
					showTimer={showActivityTimer}
					setShowTimer={setShowActivityTimer}
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

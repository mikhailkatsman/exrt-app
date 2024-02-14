import { Text, View } from "react-native"

type Props = {
  type: string,
  data: {
	name?: string,
	minuteDuration?: number,
	secondDuration?: number,
	reps?: number,
  } | number,
  completed: boolean,
}

const TimeLineSlot: React.FC<Props> = ({ type, data, completed }) => {
	const words = data.name && data.name.split(' ')

	const renderTextColor = () => {
		return completed ? 'text-custom-green' : 'text-custom-white'
	}

	return (
		<View className={`w-24 py-3 px-1
			flex-col items-center justify-between`}
		>
			{type === 'exercise' ?
				<>
					<Text className={`text-center capitalize text-xs font-BaiJamjuree-Bold ${renderTextColor()}`}>
						{words.map((word: string) => `${word} `)}
					</Text>
					{(data.minuteDuration || data.secondDuration) &&
						<Text className={`text-2xl ${data.reps <= 1 ? '' : '-mb-2'} font-BaiJamjuree-Bold ${renderTextColor()}`}>
							{data.minuteDuration && `${data.minuteDuration}'`}
							{data.secondDuration && `${data.secondDuration}"`}
						</Text>
					}
					{data.reps >= 1 &&
						<Text className={`text-2xl font-BaiJamjuree-Bold ${renderTextColor()}`}>
							x {data.reps}
						</Text>
					}
				</>
			:
				<>
					<Text className={`text-center text-xs font-BaiJamjuree-Bold ${renderTextColor()}`}>
						Rest	
					</Text>
					<Text className={`text-2xl font-BaiJamjuree-Bold ${renderTextColor()}`}>
						{data.toString()}"
					</Text>
				</>
			}
		</View>
	)
}

export default TimeLineSlot

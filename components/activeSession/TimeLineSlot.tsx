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
		<View className={`w-24 py-4 px-1
			flex-col items-center justify-between`}
		>
			{type === 'exercise' ?
				<>
					<View>
					{words.map((word: string, index: number) => (
						<Text className={`text-center capitalize text-xs font-BaiJamjuree-Bold ${renderTextColor()}`}
							key={index}
						>
							{word}
						</Text>
					))}
					</View>
					<Text className={`text-2xl font-BaiJamjuree-Bold ${renderTextColor()}`}
					>
						{data.minuteDuration && `${data.minuteDuration}'`}
						{data.secondDuration && `${data.secondDuration}"`}
						{data.reps && `x ${data.reps}`}
					</Text>
				</>
			:
				<>
					<Text className={`text-center text-xs font-BaiJamjuree-Bold mb-2 ${renderTextColor()}`}>
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

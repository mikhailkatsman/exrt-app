import { Text, View } from "react-native"

type Props = {
  type: string,
	data: {} | number
}

const TimeLineSlot: React.FC<Props> = ({ type, data }) => {
	const words = data.name && data.name.split(' ')

	return (
		<View className={`w-24 py-4 px-1
			flex-col items-center justify-between`}
		>
			{type === 'exercise' ?
				<>
					<View>
					{words.map((word: string, index: number) => (
						<Text className="text-custom-white text-center text-xs 
							font-BaiJamjuree-Bold"
							key={index}
						>
							{word}
						</Text>
					))}
					</View>
					<Text className="text-custom-white text-2xl font-BaiJamjuree-Bold">
						{data.minuteDuration && `${data.minuteDuration}'`}
						{data.secondDuration && `${data.secondDuration}"`}
						{data.reps && `x ${data.reps}`}
					</Text>
				</>
			:
				<>
					<Text className="text-custom-white text-center text-xs 
						font-BaiJamjuree-Bold mb-2"
					>
						Rest	
					</Text>
					<Text className="text-custom-white text-2xl font-BaiJamjuree-Bold">
						{data.toString()}"
					</Text>
				</>
			}
		</View>
	)
}

export default TimeLineSlot

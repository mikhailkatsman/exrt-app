import { Text, View } from "react-native"

type Props = {
  type: string,
	data: {} | number
}

const TimeLineSlot: React.FC<Props> = ({ type, data }) => {
	return (
		<View className={`h-[70%] w-24 p-2
			flex-col items-center justify-center border border-custom-white`}
		>
			{type === 'exercise' ?
				<>
					<Text className="text-custom-white text-center text-xs 
						font-BaiJamjuree-Bold mb-2"
					>
						{data.name}
					</Text>
					<Text className="text-custom-white text-2xl font-BaiJamjuree-Bold">
						x {data.reps}
					</Text>
				</>
			:
				<Text className="text-custom-white">Rest {data.toString()}s</Text>
			}
		</View>
	)
}

export default TimeLineSlot

import { Text, View, Image } from "react-native"
import { thumbnailImages } from "@modules/AssetPaths"

type Props = {
  type: string,
	data: {} | number
}

const TimeLineSlot: React.FC<Props> = ({ type, data }) => {
	return (
		<View className={`h-[70%] w-28 p-2 mr-2
			border rounded-lg
			border-custom-blue 
			flex-col items-center justify-between`}
		>
			{type === 'exercise' ?
				<Text className="text-custom-white">{data.name} x {data.reps}</Text>
			:
				<Text className="text-custom-white">Rest {data.toString()}s</Text>
			}
		</View>
	)
}

export default TimeLineSlot

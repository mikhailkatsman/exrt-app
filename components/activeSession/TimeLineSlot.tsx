import { Text, View, Image } from "react-native"
import { thumbnailImages } from "@modules/AssetPaths"

type Props = {
	isActive: boolean,
  name: string,
	style: string,
  thumbnail: keyof typeof thumbnailImages,
  sets: number,
  reps: number | null,
  minuteDuration: number | null,
  secondDuration: number | null,
  weight: number | null,
}

const TimeLineSlot: React.FC<Props> = ({
	isActive,
  name, 
	style,
  thumbnail, 
  sets, 
  reps, 
  minuteDuration, 
  secondDuration, 
  weight 
}) => {
	return (
		<View className={`h-[70%] p-2 mr-2
			border rounded-lg
			${isActive ? 'border-custom-blue' : 'border-custom-white'} 
			flex-col items-start justify-between`}
		>
			<Text className="h-1/3 text-custom-white text-xs font-BaiJamjuree-Bold">
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</Text>
			<View className="h-2/3 flex-row justify-between">
				{Array.from({ length: sets } as any).map((_, index) => (
					<View 
						key={index} 
						className={`w-20 h-full 
						${index !== sets - 1 ? 'mr-2' : ''} 
						flex justify-center items-center
	          border border-custom-white rounded`}
					>
						<Text className="text-custom-white text-lg">
							x {reps}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}

export default TimeLineSlot

import { Text, View, Image } from "react-native"
import { exerciseThumbnails } from "@modules/AssetPaths"

type Props = {
  id: number,
  name: string,
  thumbnail: keyof typeof exerciseThumbnails,
  sets: number | null,
  reps: number | null,
  minuteDuration: number | null,
  secondDuration: number | null,
  weight: number | null,
}

const TimeSlotInstanceCard: React.FC<Props> = ({ 
  id, 
  name, 
  thumbnail, 
  sets, 
  reps, 
  minuteDuration, 
  secondDuration, 
  weight 
}) => {
  return (
    <View className="w-full h-12 flex-row">
      <Image
        className="w-[22%] h-full rounded-xl"
        resizeMode="contain" 
        source={exerciseThumbnails[thumbnail]} 
      />
      <View className="w-[75%] pl-2 flex-col justify-center">
        <Text className="mb-1 text-custom-white text-xs font-BaiJamjuree-Bold">{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
        <Text className="text-custom-white text-sm font-BaiJamjuree-Light">
          {sets}
          {reps && ` x ${reps}`}
          {weight && ` with ${weight}kg`}
          {(minuteDuration || secondDuration) && ' for '}
          {minuteDuration && `${minuteDuration}m`}
          {secondDuration && `${secondDuration}s`}
        </Text>
      </View>
    </View>
  )
}

export default TimeSlotInstanceCard

import { Text, View, Image } from "react-native"
import { thumbnailImages } from "@modules/AssetPaths"

type Props = {
  id: number,
  name: string,
  thumbnail: keyof typeof thumbnailImages,
  sets: number|null,
  reps: number|null,
  duration: number|null,
  weight: number|null,
}

const TimeSlotInstanceCard: React.FC<Props> = ({ 
  id, 
  name, 
  thumbnail, 
  sets, 
  reps, 
  duration, 
  weight 
}) => {
  return (
    <View className="w-full h-12 mb-3 flex-row">
      <Image
        className="w-[25%] h-full rounded-xl"
        resizeMode="contain" 
        source={thumbnailImages[thumbnail]} 
      />
      <View className="w-[75%] pl-2 flex-col justify-center">
        <Text className="mb-1 text-custom-white text-xs font-BaiJamjuree-Bold">{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
        <Text className="text-custom-white text-sm font-BaiJamjuree-Light">
          {sets}{reps && ` x ${reps}`}{weight && ` of ${weight}kg`}{duration && ` for ${duration}"`}
        </Text>
      </View>
    </View>
  )
}

export default TimeSlotInstanceCard

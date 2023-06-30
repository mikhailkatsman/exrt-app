import { Text, View, Image } from "react-native"

import { thumbnailImages } from "../../modules/AssetPaths"

type Props = {
  id: number,
  name: string,
  thumbnail: keyof typeof thumbnailImages,
  sets: number|null,
  reps: number|null,
  duration: number|null,
  weight: number|null,
}

const InstanceCard: React.FC<Props> = ({ 
  id, 
  name, 
  thumbnail, 
  sets, 
  reps, 
  duration, 
  weight 
}) => {
  return (
    <View className="w-full h-12 mb-2 flex-row">
      <Image
        className="w-[25%] h-full rounded-xl"
        resizeMode="contain" 
        source={thumbnailImages[thumbnail]} 
      />
      <View className="w-[75%] pl-2 flex-col justify-center">
        <Text className="text-custom-white text-xs font-bold">{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
        {duration ? (
          <Text className="text-custom-white text-sm">{sets} x {duration}"</Text>
        ) : (
          <Text className="text-custom-white text-sm">{sets} x {reps}</Text>
        )}
      </View>
    </View>
  )
}

export default InstanceCard

import { Text, View, Image, TouchableOpacity, Pressable } from "react-native"
import { thumbnailImages } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"

type Props = {
  id: number,
  selectedId: number | null,
  setSelectedId: (id: number) => void,
  name: string,
  thumbnail: keyof typeof thumbnailImages,
}

const InstanceCard: React.FC<Props> = ({ id, selectedId, setSelectedId, name, thumbnail }) => {

  return (
    <Pressable className={`
      w-full h-16 mb-2 p-1 flex-row border-2 rounded-xl
      ${selectedId === id ? 'border-custom-blue' : ''}
      `}
      onPress={() => setSelectedId(id)}
    >
      <Image
        className="w-1/6 h-full rounded-lg"
        resizeMode="contain" 
        source={thumbnailImages[thumbnail]} 
      />
      <View className="w-2/3 pl-3 flex-col justify-center">
        <Text className="text-custom-white text-lg">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
      </View>
      <TouchableOpacity className="w-1/6 flex justify-center items-center">
        <Icon name="information-outline" size={24} color="#F5F6F3" />
      </TouchableOpacity>
    </Pressable>
  )
}

export default InstanceCard

import { Text, View, Image, TouchableOpacity } from "react-native"
import { thumbnailImages } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import DB from "../../modules/DB"

type Props = {
  updateInstances: () => void,
  id: number,
  name: string,
  thumbnail: keyof typeof thumbnailImages,
  sets: number|null,
  reps: number|null,
  duration: number|null,
  weight: number|null,
}

const InstanceCard: React.FC<Props> = ({ 
  updateInstances,
  id, 
  name, 
  thumbnail, 
  sets, 
  reps, 
  duration, 
  weight 
}) => {
  const deleteInstance = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        DELETE FROM session_exercise_instances
        WHERE exercise_instance_id = ?;
      `, [id], () => console.log(`Deleted instance: ${id} from session`))

      tx.executeSql(`
        DELETE FROM exercise_instances
        WHERE id = ?;
      `, [id], () => console.log(`Deleted instance: ${id} from exercise instances`))
    },
      error => console.log('Error deleting instance: ' + error),
      () => updateInstances()
    )
  }

  return (
    <View className="w-full h-16 mb-3 flex-row">
      <Image
        className="w-[20%] h-full rounded-xl"
        resizeMode="contain" 
        source={thumbnailImages[thumbnail]} 
      />
      <View className="w-[50%] pl-3 flex-col justify-center">
        <Text className="text-custom-white mb-1 text-sm font-BaiJamjuree-Bold">{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
        <Text className="text-custom-white text-lg font-BaiJamjuree-Light">
          {sets}{reps && ` x ${reps}`}{weight && ` of ${weight}kg`}{duration && ` for ${duration}"`}
        </Text>
      </View>
      <TouchableOpacity 
        className="w-[15%] flex items-center justify-center"
        onPress={() => {}}
        activeOpacity={1}
      >
        <Icon name="information-outline" size={22} color='#F5F6F3' />
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-[15%] flex items-center justify-center"
        onPress={deleteInstance}
        activeOpacity={1}
      >
        <Icon name="delete-outline" size={26} color='#F4533E' />
      </TouchableOpacity>
    </View>
  )
}

export default InstanceCard

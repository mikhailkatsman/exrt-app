import { Text, View, Image, TouchableOpacity } from "react-native"
import { thumbnailImages } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import DB from "@modules/DB"
import { useNavigation } from "@react-navigation/native"

type Props = {
  updateInstances: () => void,
  drag: () => void,
  isActive: boolean,
  id: number,
  name: string,
  thumbnail: keyof typeof thumbnailImages,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  duration: number | null,
}

const InstanceCard: React.FC<Props> = ({ 
  updateInstances,
  drag,
  isActive,
  id, 
  name, 
  thumbnail, 
  sets, 
  reps, 
  weight, 
  duration
}) => {
  const navigation = useNavigation()

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
      <View className="w-[55%] pl-3 flex-col justify-center">
        <Text className="text-custom-white mb-1 text-sm font-BaiJamjuree-Bold">{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
        <Text className="text-custom-white text-lg font-BaiJamjuree-Light">
          {sets}{reps && ` x ${reps}`}{weight && ` of ${weight}kg`}{duration && ` for ${duration}"`}
        </Text>
      </View>
      <TouchableOpacity 
        className="w-[15%] flex items-center justify-center"
        onPress={() => {
          navigation.navigate('ConfirmModal', {
            text: 'Are you sure you want to delete this exercise?',
            onConfirm: deleteInstance
          })
        }}
        activeOpacity={1}
        disabled={isActive}
      >
        <Icon name="delete-outline" size={26} color='#F4533E' />
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-[10%] h-full flex items-end justify-center"
        onPressIn={drag}
        activeOpacity={1}
        disabled={isActive}
      >
        <Icon name="unfold-more-horizontal" size={26} color='#F5F6F3' />
      </TouchableOpacity>
    </View>
  )
}

export default InstanceCard

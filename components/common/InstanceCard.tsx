import { Text, View, Image, TouchableOpacity } from "react-native"
import { DeviceEventEmitter } from "react-native";
import { exerciseThumbnails } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import DB from "@modules/DB"
import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"

type Props = {
  updateInstances: () => void,
  drag: () => void,
  isActive: boolean,
  id: number,
  name: string,
  thumbnail: keyof typeof exerciseThumbnails,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  minuteDuration: number | null,
  secondDuration: number | null,
  isEditable: boolean,
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
  minuteDuration,
  secondDuration,
  isEditable
}) => {
  const navigation = useNavigation()

  const deleteInstance = () => {
  DB.transaction(tx => {
    tx.executeSql(`
    DELETE FROM session_exercise_instances
    WHERE exercise_instance_id = ?;
    `, [id])

    tx.executeSql(`
    DELETE FROM exercise_instances
    WHERE id = ?;
    `, [id])
  },
    error => console.log('Error deleting instance: ' + error),
    () => updateInstances()
  )
  }

  useEffect(() => {
  const deleteInstanceEventListener = DeviceEventEmitter.addListener(`deleteEventInstance${id}`, deleteInstance)

  return () => {
    deleteInstanceEventListener.remove()
  }
  }, [])

  return (
  <View className="w-full h-20 mb-5 flex-row pl-2 py-2 rounded-xl border-x-2 border-custom-white">
    <Image
    className="w-[20%] h-full rounded-lg"
    resizeMode="contain" 
    source={exerciseThumbnails[thumbnail]} 
    />
    <View className="w-[56%] pl-3 flex-col justify-center">
    <Text className="text-custom-white mb-1 mr-2 text-sm font-BaiJamjuree-Bold">
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </Text>
    <Text className="text-custom-white font-BaiJamjuree-Light mr-2">
      {sets}
      {reps && ` x ${reps}`}
      {weight && ` with ${weight}kg`}
      {(minuteDuration || secondDuration) && ' for '}
      {minuteDuration && `${minuteDuration}m `}
      {secondDuration && `${secondDuration}s`}
    </Text>
    </View>
    {isEditable &&
    <TouchableOpacity 
      className="w-[10%] flex items-center justify-center"
      onPress={() => {
      navigation.navigate('ConfirmModal', {
        text: 'Are you sure you want to delete this exercise?',
        eventId: `Instance${id}`
      })
      }}
      activeOpacity={1}
      disabled={isActive}
    >
      <Icon name="delete-outline" size={28} color='#F4533E' />
    </TouchableOpacity>
    }
    {isEditable &&
    <TouchableOpacity 
      className="w-[14%] h-full flex items-center justify-center"
      onPressIn={drag}
      activeOpacity={1}
      disabled={isActive}
    >
      <Icon name="unfold-more-horizontal" size={30} color='#F5F6F3' />
    </TouchableOpacity>
    }
  </View>
  )
}

export default InstanceCard

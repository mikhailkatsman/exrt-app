import { Icon } from "@react-native-material/core"
import { useNavigation } from "@react-navigation/native"
import { Text, TouchableOpacity, View } from "react-native"

type Props = {
  id: number,
  name: string,
  status: string,
}

const PhaseCard: React.FC<Props> = ({ id, name, status }) => {
  const navigation = useNavigation()

  const renderStatus = () => {
    if (status === 'active') {
      return <Text className="text-custom-blue text-sm font-BaiJamjuree-LightItalic">In Progress</Text>
    } else if (status === 'completed') {
      return <Text className="text-custom-green text-sm font-BaiJamjuree-LightItalic">Completed</Text>
    }

    return
  }

  return (
    <TouchableOpacity className="w-full h-16 p-3 mb-3 
      flex-row justify-between items-center
      rounded-xl border border-custom-white"
      onPress={() => navigation.navigate('Hub', { phaseId: id })}
    >
      <Text className="text-custom-white font-BaiJamjuree-Bold">{name}</Text>
      <View className="w-[35%] flex-row justify-end items-center">
        {renderStatus()}
        <Icon name="chevron-right" color="#F5F6F3" size={28} /> 
      </View>
    </TouchableOpacity>
  )
}

export default PhaseCard

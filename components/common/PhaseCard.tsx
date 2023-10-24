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
      return <Text className="mr-2 py-1 px-2 text-center text-custom-white border rounded-xl border-custom-white text-xs font-BaiJamjuree-LightItalic">In Progress</Text>
    } else if (status === 'completed') {
      return <Text className="mr-2 py-1 px-2 text-center text-custom-green border rounded-xl border-custom-green text-xs font-BaiJamjuree-LightItalic">Completed</Text>
    }
    return
  }

  return (
    <TouchableOpacity className="w-full h-20 p-3 mb-5 
      flex-row justify-between items-center
      rounded-2xl border-x-2 border-custom-white"
      onPress={() => navigation.navigate('EditPhase', { 
        phaseId: id, 
        phaseName: name,
        phaseStatus: status
      })}
      activeOpacity={0.6}
    >
      <Text className="w-[60%] text-custom-white text-lg font-BaiJamjuree-Bold">{name}</Text>
      <View className="w-[40%] flex-row justify-end items-center">
        {renderStatus()}
        <Icon name="chevron-right" color="#F5F6F3" size={32} /> 
      </View>
    </TouchableOpacity>
  )
}

export default PhaseCard

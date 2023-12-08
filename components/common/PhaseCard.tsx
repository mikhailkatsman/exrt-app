import { Icon } from "@react-native-material/core"
import { useNavigation } from "@react-navigation/native"
import { Text, TouchableOpacity, View } from "react-native"

type Props = {
  id: number,
  name: string,
  custom: number,
  status: string,
}

const PhaseCard: React.FC<Props> = ({ id, name, custom, status }) => {
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
    <TouchableOpacity className={`w-full h-24 px-3 mb-8 
      flex-row justify-between items-center
      rounded-2xl border-x-2 
      ${status === 'completed' ? 'border-custom-grey' : 'border-custom-white'}`}
      onPress={() => {
        navigation.navigate('EditPhase', { 
          phaseId: id, 
          phaseName: name,
          phaseCustom: custom,
          phaseStatus: status,
          newPhase: false
        })
      }}
      activeOpacity={0.6}
    >
      <Text 
        className={`w-[60%] pr-3 text-lg font-BaiJamjuree-Bold 
          ${status === 'completed' ? 'text-custom-grey' : 'text-custom-white'}
        `} 
        style={{ lineHeight: 22 }}
      >
        {name}
      </Text>
      <View className="w-[40%] flex-row justify-end items-center">
        {renderStatus()}
        <Icon name="chevron-right" color={status === 'completed' ? "#505050" : "#F5F6F3"} size={32} /> 
      </View>
    </TouchableOpacity>
  )
}

export default PhaseCard

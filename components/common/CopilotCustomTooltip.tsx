import { useCopilot, TooltipProps } from 'react-native-copilot'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import tourNavigationMap from '@modules/TourNavigationMap'

const CopilotCustomTooltip: React.FC<TooltipProps> = ({ labels }) => {
  const copilot = useCopilot()
  const navigation = useNavigation()

  const handlePress = async () => {
    const nextScreen = tourNavigationMap[copilot.currentStep?.name] ?? null

    if (!nextScreen && !copilot.isLastStep) {
      await copilot.goToNext()
      return
    }

    await copilot.stop()

    setTimeout(() => {
      navigation.navigate(
        nextScreen ? nextScreen.screenName : 'Home',
        nextScreen ? nextScreen.screenProps : { isFirstTime: false }
      )
    }, 150)
  }

  return (
    <View>
      <View className='h-fit'>
        <Text className='text-custom-dark font-BaiJamjuree-Regular'>
          {copilot.currentStep?.text}
        </Text>
      </View>
      <View className='my-3 flex-row justify-end'>
        <TouchableOpacity
          onPress={handlePress}
          className='p-3 border-2 rounded-xl border-custom-dark justify-center'
        >
          <Text className='text-custom-dark font-BaiJamjuree-Bold'>
            {tourNavigationMap[copilot.currentStep?.name] ?
              'Continue' :
              copilot.isLastStep ?
                labels.finish :
                labels.next
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CopilotCustomTooltip

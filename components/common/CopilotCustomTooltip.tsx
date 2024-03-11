import { useCopilot, TooltipProps } from 'react-native-copilot'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import tourNavigationMap from '@modules/TourNavigationMap'

const CopilotCustomTooltip: React.FC<TooltipProps> = ({ labels }) => {
  const copilot = useCopilot()

  const navigation = useNavigation()

  const handleStop = async () => {
    await copilot.stop().then(() => console.log('COPILOT STOPPED'))

    const nextScreen = tourNavigationMap[copilot.currentStep?.name] ?? null

    if (nextScreen) {
      setTimeout(() => {
        navigation.navigate(
          nextScreen.screenName, 
          nextScreen.screenProps
        )
      }, 150)
    }     
  }

  const handleNext = () => {
    console.log('NEXT STEP CALLED')
    void copilot.goToNext()
  }

  return (
    <View>
      <View className='h-fit'>
        <Text className='text-custom-dark font-BaiJamjuree-Regular'>
          {copilot.currentStep?.text}
        </Text>
      </View>
      <View className='my-3 flex-row justify-end'>
        {!copilot.isLastStep ? (
          <TouchableOpacity onPress={handleStop} className='p-3'>
            <Text className='text-custom-light-grey font-BaiJamjuree-Bold'>
              {labels.skip}
            </Text>
          </TouchableOpacity>
        ) : null}
        {!copilot.isLastStep ? (
          <TouchableOpacity onPress={handleNext} className='p-3'>
            <Text className='text-custom-dark font-BaiJamjuree-Bold'>
              {labels.next}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
              onPress={handleStop} 
              className='p-3 border-2 rounded-xl border-custom-dark justify-center'
          >
            <Text className='text-custom-dark font-BaiJamjuree-Bold'>
              {tourNavigationMap[copilot.currentStep?.name] ? 'Continue' : labels.finish}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CopilotCustomTooltip

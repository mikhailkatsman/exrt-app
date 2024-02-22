import { useCopilot, TooltipProps } from 'react-native-copilot'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import tourNavigationMap from '@modules/TourNavigationMap'

const CopilotCustomTooltip: React.FC<TooltipProps> = ({ labels }) => {
  const { goToNext, stop, currentStep, isLastStep } = useCopilot()

  const navigation = useNavigation()

  const handleStop = () => {
    const nextScreen = tourNavigationMap[currentStep?.name]
    if (nextScreen) {
      navigation.navigate(
        nextScreen.screenName, 
        nextScreen.screenProps
      )
    } else {
      void stop()
    }
  }

  const handleNext = () => {
    void goToNext()
  }

  return (
    <View>
      <View className='h-fit'>
        <Text className='text-custom-dark font-BaiJamjuree-Regular'>
          {currentStep?.text}
        </Text>
      </View>
      <View className='my-3 flex-row justify-end'>
        {!isLastStep ? (
          <TouchableOpacity onPress={handleStop} className='p-3'>
            <Text className='text-custom-light-grey font-BaiJamjuree-Bold'>
              {labels.skip}
            </Text>
          </TouchableOpacity>
        ) : null}
        {!isLastStep ? (
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
              {tourNavigationMap[currentStep?.name] ? 'Continue' : labels.finish}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CopilotCustomTooltip

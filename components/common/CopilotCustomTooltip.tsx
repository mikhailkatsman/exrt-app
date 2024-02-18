import { useCopilot, TooltipProps } from 'react-native-copilot'
import { View, Text, TouchableOpacity } from 'react-native'

const CopilotCustomTooltip: React.FC<TooltipProps> = ({ labels }) => {
  const { goToNext, goToPrev, stop, currentStep, isFirstStep, isLastStep } = useCopilot()

  const handleStop = () => {
    void stop()
  }

  const handleNext = () => {
    void goToNext()
  }


  const handlePrev = () => {
    void goToPrev()
  }

  return (
    <View>
      <View className='h-fit'>
        <Text className='text-custom-dark font-BaiJamjuree-Regular'>
          {currentStep?.text}
        </Text>
      </View>
      <View className='mt-3 flex-row justify-end'>
        {!isLastStep ? (
          <TouchableOpacity onPress={handleStop} className='p-3'>
            <Text className='text-custom-dark font-BaiJamjuree-Bold'>
              {labels.skip}
            </Text>
          </TouchableOpacity>
        ) : null}
        {!isFirstStep ? (
          <TouchableOpacity onPress={handlePrev} className='p-3'>
            <Text className='text-custom-dark font-BaiJamjuree-Bold'>
              {labels.previous}
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
          <TouchableOpacity onPress={handleStop} className='p-3'>
            <Text className='text-custom-dark font-BaiJamjuree-Bold'>
              {labels.finish}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CopilotCustomTooltip

import { useCopilot, TooltipProps } from 'react-native-copilot'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import tourNavigationMap from '@modules/TourNavigationMap'
import DB from '@modules/DB'

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

    if (copilot.currentStep?.order === 2) {
      DB.transaction(tx => {
        tx.executeSql(`
          UPDATE programs
          SET status = 'active'
          WHERE id = 1;
        `, [])

        tx.executeSql(`
          UPDATE phases
          SET status = 'active'
          WHERE id = (
            SELECT phase_id
            FROM program_phases
            WHERE program_id = 1
          );
        `, [])
      }, error => console.error('Error updating program status: ' + error))
    }

    if (copilot.currentStep?.order !== 9 && copilot.currentStep?.order !== 10) {
      setTimeout(() => {
        navigation.navigate(nextScreen.screenName, nextScreen.screenProps)
      }, 150)
    }
  }

  return (
    <View>
      <Text className='mb-3 flex-row'>
        {copilot.currentStep?.text.map((segment, index) => (
          <Text
            key={index}
            className={`
              font-BaiJamjuree-${segment.bold ? 'Bold' : 'Regular'}${segment.italic ? 'Italic ' : ' '}
              text-custom-${segment.color || 'dark'}
            `}
          >
            {segment.text}
            {segment.icon}
          </Text>
        ))}
      </Text>
      <View className='flex-row justify-end'>
        <TouchableOpacity
          onPress={handlePress}
          className='px-3 pt-5 pb-3 justify-center'
          activeOpacity={0.6}
        >
          <Text className='text-custom-dark font-BaiJamjuree-Bold'>
            {tourNavigationMap[copilot.currentStep?.name] ?
              'Continue' :
              copilot.isLastStep && copilot.currentStep?.order !== 9 ?
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

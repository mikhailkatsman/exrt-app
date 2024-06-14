import { View } from "react-native"

type Props = {
  statuses: string[]
}

const DaySessionIndicator: React.FC<Props> = ({ statuses }) => {
  const setBorderColor = (status: string, index: number) => {
  let color = '#F5F6F3'
  switch (status) {
    case 'completed':
    color = '#74AC5D'
    break
    case 'missed':
    color = '#F4533E'
    break
    default:
    break
  }

  return ( 
    <View 
    key={index}
    className="h-full w-2 rounded border-2" 
    style={{ 
      borderColor: color, 
      marginHorizontal: 1, 
      backgroundColor: status === 'upcoming' ? undefined : color
    }}
    />
  )
  }

  return (
  <View className="h-2/3 pt-3 pb-2 px-1 flex-row justify-center items-center">
    {statuses.map((item, index) => setBorderColor(item, index) )}
  </View>
  )
}

export default DaySessionIndicator

import { View } from "react-native"

type Props = {
  width: number
}

const SelectedDay: React.FC<Props> = ({ width }) => {
  return (
    <View 
      className="
        absolute h-20
        border-x-2 border-custom-white 
        rounded-xl
      "
      style={{ width: width }}
    />
  )
}

export default SelectedDay

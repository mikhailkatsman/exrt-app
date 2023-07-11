import { Pressable, ScrollView, Text, View, Modal } from "react-native"
import { useState } from "react"

type Props = {
  placeholder: string,
  listItems: { label: string, value: string | number }[]
}

const DropDown: React.FC<Props> = ({ placeholder, listItems }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [displayedText, setDisplayedText] = useState<string>(placeholder)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <Modal visible={isOpen} transparent={true} statusBarTranslucent={true} onDismiss={() => setIsOpen(false)}>
      </Modal>
      <Pressable 
        className={`
          h-10 w-32 border-2 border-custom-white 
          ${isOpen ? 'rounded-t-lg' : 'rounded-lg'} 
          justify-center items-center
        `} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className="text-custom-white text-lg font-bold">{displayedText}</Text>
      {isOpen && (
        <View className="absolute top-9 h-60 w-32 border-2 border-custom-white rounded-b-lg">
          <ScrollView></ScrollView>
        </View>
      )}
      </Pressable>
    </>
  )
}

export default DropDown

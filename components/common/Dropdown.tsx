import { Pressable, ScrollView, Text, TouchableOpacity, Modal } from "react-native"
import { useState, useRef } from "react"

type Props = {
  placeholder: string,
  listItems: { label: string, value: string | number }[]
}

const DropDown: React.FC<Props> = ({ placeholder, listItems }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [displayedText, setDisplayedText] = useState<string>(placeholder)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dropDownRef = useRef<null | TouchableOpacity>(null)
  const [dropDownPosition, setDropDownPosition] = useState<{x: number, y: number} | null>(null)

  const handleLayout = () => {
    dropDownRef.current.measure((x, y, width, height, pageX, pageY) => {
      setDropDownPosition({
        x: pageX,
        y: pageY + height
      })

      console.log(dropDownPosition)
    })
  }

  return (
    <>
      <TouchableOpacity
        ref={dropDownRef}
        onLayout={handleLayout}
        className={`
          h-10 w-32 border-2 border-custom-white 
          ${isOpen ? 'rounded-t-lg' : 'rounded-lg'} 
          justify-center items-center
        `} 
        activeOpacity={1}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className="text-custom-white text-lg font-bold">{displayedText}</Text>
      </TouchableOpacity>
      {isOpen && (
        <Modal
          onDismiss={() => setIsOpen(!isOpen)}
          transparent={true}
        >
          <ScrollView 
            className="h-36 w-32 border-2 border-custom-white rounded-b-lg"
            showsVerticalScrollIndicator={false}
          >
            {listItems.map((item, index) => (
              <TouchableOpacity 
                key={`item-${index}`}
                activeOpacity={1}
                className={`
                  h-10 justify-center items-center 
                  ${index === listItems.length - 1 ? '' : 'border-b border-custom-white'}
                `}
                onPress={() => {
                  setSelectedIndex(index)
                  setDisplayedText(item.label)
                  setIsOpen(!isOpen)
                }}
              >
                <Text className="text-custom-white">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      )}
    </>
  )
}

export default DropDown

import { Pressable, ScrollView, Text, TouchableOpacity, Modal, View } from "react-native"
import { useState, useRef } from "react"
import { Icon } from "@react-native-material/core"

type Props = {
  placeholder: string,
  listItems: { label: string, value: string | number }[]
}

const DropDown: React.FC<Props> = ({ placeholder, listItems }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [displayedText, setDisplayedText] = useState<string>(placeholder)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dropDownRef = useRef<null | TouchableOpacity>(null)
  const [dropDownPosition, setDropDownPosition] = useState<{x: number, y: number}>({x: 0, y: 0})

  const handleDropdownState = () => {
    setIsOpen(!isOpen)
  }

  const handleLayout = () => {
    dropDownRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropDownPosition({
        x: pageX,
        y: pageY,
      })
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
          flex-row items-center
        `} 
        activeOpacity={1}
        onPress={handleDropdownState}
      >
        <Text className="w-[80%] pl-2 text-custom-white">{displayedText}</Text>
        <View className="w-[20%]">
          <Icon name="arrow-down-right" size={20} color="#F5F6F3" />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <Modal
          onDismiss={handleDropdownState}
          onRequestClose={handleDropdownState}
          transparent={true}
        >
          <Pressable className="w-full h-full bg-custom-dark/60" onPress={handleDropdownState} />
          <View className="w-32 border-2 border-custom-white rounded-lg"
            style={{ position: "absolute", top: dropDownPosition.y, left: dropDownPosition.x }}
          >
            <View className="h-9" />
            <ScrollView 
              className={`
                ${listItems.length < 4 ? 'h-30' : 'h-48'} 
                bg-custom-dark rounded-b-lg
              `}
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              fadingEdgeLength={100}
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
                    handleDropdownState()
                  }}
                >
                  <Text className="text-custom-white">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  )
}

export default DropDown

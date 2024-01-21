import { Pressable, ScrollView, Text, TouchableOpacity, Modal, View } from "react-native"
import { useState, useRef } from "react"
import { Icon } from "@react-native-material/core"

type Props = {
  placeholder: string,
  listItems: { label: string, value: string | number }[],
  onIndexChange: (index: number) => void,
  reset: () => void
}

const DropDown: React.FC<Props> = ({ placeholder, listItems, onIndexChange, reset }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [displayedText, setDisplayedText] = useState<string>(placeholder)
  const [dropDownPosition, setDropDownPosition] = useState<{x: number, y: number}>({x: 0, y: 0})

  const dropDownRef = useRef<null | TouchableOpacity>(null)

  const handleDropdownState = () => setIsOpen(!isOpen)

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
          h-10 w-40 border-2 border-custom-white 
          ${isOpen ? 'rounded-t-xl' : 'rounded-xl'} 
          flex-row items-center
        `} 
        activeOpacity={1}
        onPress={handleDropdownState}
      >
        <Text className="w-[80%] pl-2 text-custom-white text-xs font-BaiJamjuree-Bold">{displayedText}</Text>
        <View className="w-[20%]">
          <Icon name="arrow-down-right" size={20} color="#F5F6F3" />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <Modal
          onDismiss={handleDropdownState}
          onRequestClose={handleDropdownState}
          transparent={true}
          animationType="none"
        >
          <Pressable className="w-full h-full bg-custom-dark/60" onPress={handleDropdownState} />
          <View className="w-40 border-2 border-custom-white rounded-xl"
            style={{ position: "absolute", top: dropDownPosition.y, left: dropDownPosition.x }}
          >
            <TouchableOpacity 
              className="h-9 bg-custom-dark rounded-t-xl flex-row items-center"
              onPress={() => {
                setDisplayedText(placeholder)
                handleDropdownState()
                reset()
              }}
            >
              <Text className="w-[80%] pl-2 text-custom-white text-xs font-BaiJamjuree-Bold">{displayedText}</Text>
              <View className="w-[20%]">
                <Icon name="close" size={18} color="#F5F6F3" />
              </View>
            </TouchableOpacity>
            <ScrollView 
              className={`
                ${listItems.length < 5 ? 'h-fit' : 'h-40'} 
                bg-custom-dark rounded-b-xl
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
                    setDisplayedText(item.label)
                    handleDropdownState()
                    onIndexChange(index)
                  }}
                >
                  <Text className="text-custom-white font-BaiJamjuree-Regular">{item.label}</Text>
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

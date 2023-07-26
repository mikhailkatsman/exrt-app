import { useMemo, useState, useRef } from "react"
import { Icon } from "@react-native-material/core"
import { TouchableOpacity, Text, View, Modal, Pressable } from "react-native"
import ScrollPicker from "../common/ScrollPicker"
import { useNavigation } from "@react-navigation/native"
import DB from "../../modules/DB"

type Props = { selectedDay: number }

const SessionTimePicker: React.FC<Props> = ({ selectedDay }) => {
  const navigation = useNavigation()

  const [isActive, setIsActive] = useState<boolean>(false)
  const [buttonPosition, setButtonPosition] = useState<{x: number, width: number, yb: number}>({x: 0, width: 0, yb: 0})
  const [selectedTime, setSelectedTime] = useState<string>('00:00')

  const buttonRef = useRef<null | TouchableOpacity>(null)

  const hourValues: string[] = useMemo(() => {
    const values = []
    for (let i = 0; i <= 23; i++) values.push(i.toString().padStart(2, '0'))
    return values
  }, [])
  const minuteValues: string[] = useMemo(() => {
    const values = []
    for (let i = 0; i <= 59; i++) values.push(i.toString().padStart(2, '0'))
    return values
  }, [])

  const handleLayout = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setButtonPosition({
        x: pageX,
	width: width,
        yb: pageY + height,
      })
    })
  }

  const handlePress = () => setIsActive(!isActive)

  const navigateToNewSessionScreen = () => {
    DB.sql(`
      INSERT INTO sessions (time) VALUES (?)
    `, [selectedTime], 
    (_, result) => {
      navigation.navigate("NewSession", {
	  routineId: selectedDay,
	  sessionExists: false,
	  sessionId: result.insertId, 
	  sessionTime: selectedTime
      })
      handlePress()
    })
  }

  return (
    <>
      <TouchableOpacity 
	ref={buttonRef}
	onLayout={handleLayout}
	className={`
	  h-14 border-2 border-custom-white
	  flex-1 items-center justify-center 
	  rounded-xl bg-custom-white
	`}
	onPress={handlePress}
	activeOpacity={0.5}
      >
	<Text className="text-xs font-bold mb-1">Create New Session</Text>
	<Icon name="dumbbell" color="#080B06" size={22} /> 
      </TouchableOpacity>
      {isActive && (
	<Modal
	  onDismiss={handlePress}
	  onRequestClose={handlePress}
	  transparent={true}
	>
          <Pressable className="w-full h-full bg-custom-dark/60" onPress={handlePress} />
	  <View
	    style={{
	      position: "absolute",
	      left: buttonPosition.x,
	      width: buttonPosition.width,
	      top: buttonPosition.yb - 208, 
	    }}
	    className="
	      h-52 border-2 border-custom-white rounded-xl 
	      bg-custom-dark flex-col
	    "
	  >
	    <View className="w-full mt-4 flex-col justify-center items-center">
	      <Text className="text-custom-white mb-2">Choose Time:</Text>
	      <View className="flex-row items-center">
		<ScrollPicker 
		  dataArray={hourValues} 
		  width={32} 
		  onIndexChange={(index: number) => 
		    setSelectedTime(hourValues[index] + selectedTime.slice(2))
		  } 
		/>
		<Text className="text-custom-white mx-1 font-bold text-xl">:</Text>
		<ScrollPicker 
		  dataArray={minuteValues} 
		  width={32} 
		  onIndexChange={(index: number) => 
		    setSelectedTime(selectedTime.slice(0, 3) + minuteValues[index])
		  } 
		/>
	      </View>
	    </View>
	  </View>
	  <TouchableOpacity
	    className="h-14 bg-custom-white rounded-xl flex-row items-center justify-center"
	    style={{
	      position: "absolute",
	      left: buttonPosition.x,
	      width: buttonPosition.width,
	      top: buttonPosition.yb - 56, 
	    }}
	    activeOpacity={1}
	    onPress={navigateToNewSessionScreen}
	  >
	    <Text className="text-xs font-bold mr-2">Confirm</Text>
	    <Icon name="check" color="#080B06" size={22} /> 
	  </TouchableOpacity>
	</Modal>
      )}
    </>
  )
}

export default SessionTimePicker

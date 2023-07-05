import { ComponentType } from "react";
import { View, Text } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";

type Props = {
  setRepValues: number[],
  kgValues: number[],
  timeValues: string[],
}

const ScrollPickerGrid: ComponentType<Props> = ({ setRepValues, kgValues, timeValues }) => {
  return (
    <View className="h-[25%] w-full mb-3">
      <View className="h-[50%] w-full flex-row">
	<View className="flex-1 flex-row items-center justify-start ml-3">
	  <Text className="text-custom-white text-xl">Sets</Text>
	  <View className="w-16">
	    <ScrollPicker
	      dataSource={setRepValues}
	      selectedIndex={0}
	      onValueChange={(data, selectedIndex) => {}}
	      wrapperHeight={90}
	      wrapperColor='#080B06'
	      highlightColor="#080B06"
	    />
	  </View>
	</View>
	<View className="flex-1 flex-row items-center justify-end">
	  <Text className="text-custom-white text-xl">Weight</Text>
	  <View className="w-16">
	    <ScrollPicker
	      dataSource={kgValues}
	      selectedIndex={0}
	      onValueChange={(data, selectedIndex) => {}}
	      wrapperHeight={90}
	      wrapperColor='#080B06'
	      highlightColor="#080B06"
	    />
	  </View>
	  <Text className="text-custom-white text-lg mr-3">kg</Text>
	</View>
      </View>
      <View className="h-[50%] w-full flex-row mb-2">
	<View className="flex-1 flex-row items-center justify-start ml-3">
	  <Text className="text-custom-white text-xl">Reps</Text>
	  <View className="w-14">
	    <ScrollPicker
	      dataSource={setRepValues}
	      selectedIndex={0}
	      onValueChange={(data, selectedIndex) => {}}
	      wrapperHeight={90}
	      wrapperColor='#080B06'
	      highlightColor="#080B06"
	    />
	  </View>
	</View>
	<View className="flex-1 flex-row items-center justify-end mr-1">
	  <Text className="text-custom-white text-xl mr-1">Duration</Text>
	  <View className="w-10">
	    <ScrollPicker
	      dataSource={timeValues}
	      selectedIndex={0}
	      onValueChange={(data, selectedIndex) => {}}
	      wrapperHeight={90}
	      wrapperColor='#080B06'
	      highlightColor="#080B06"
	    />
	  </View>
	  <Text className="text-custom-white text-lg">m</Text>
	  <View className="w-10">
	    <ScrollPicker
	      dataSource={timeValues}
	      selectedIndex={0}
	      onValueChange={(data, selectedIndex) => {}}
	      wrapperHeight={90}
	      wrapperColor='#080B06'
	      highlightColor="#080B06"
	    />
	  </View>
	  <Text className="text-custom-white text-lg mr-3">s</Text>
	</View>
      </View>
    </View>
  )
}

export default ScrollPickerGrid

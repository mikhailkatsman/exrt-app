import { View, Text, ScrollView } from "react-native"

const Routine: React.FC = () => {
  return (
    <>
      <View className="h-2/3 py-1 my-1">
	<View className="w-full h-full border overflow-hidden rounded-xl border-custom-white">
	  <View className="bg-custom-white w-full p-2 h-[10%]">
	    <Text className="text-custom-dark text-xs">20/09/2023</Text>
	  </View>
	  <ScrollView>
	    
	  </ScrollView>
	</View>
      </View>
    </>
  )
}

export default Routine

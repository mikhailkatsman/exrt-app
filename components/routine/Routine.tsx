import { View, Text, ScrollView } from "react-native"

type Props = {
  date: Date,
}

const Routine: React.FC<Props> = ({ date }) => {
  const dateNow: string = date.toDateString()
  return (
    <>
      <View className="h-2/3 py-1 my-1">
	<View className="w-full h-full border overflow-hidden rounded-xl border-custom-light-green">
	  <View className="bg-custom-light-green w-full p-2 h-[10%]">
	    <Text className="text-custom-dark text-xs">{dateNow}</Text>
	  </View>
	  <ScrollView>
	    
	  </ScrollView>
	</View>
      </View>
    </>
  )
}

export default Routine

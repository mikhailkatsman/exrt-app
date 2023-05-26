import { View, Text, ScrollView } from "react-native"

type Props = {
  date: Date,
}

const Routine: React.FC<Props> = ({ date }) => {
  const dateNow: string = date.toDateString()
  return (
    <>
      <View className="w-full h-2/3 py-1 my-1">
	<View className="w-full h-full border p-2 rounded-xl border-slate-700">
	  <Text className="text-white text-xs">{dateNow}</Text>
	  <ScrollView>
	    
	  </ScrollView>
	</View>
      </View>
    </>
  )
}

export default Routine

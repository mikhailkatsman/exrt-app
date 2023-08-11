import { FlatList, View } from "react-native"
import TimeLineSlot from "./TimeLineSlot"

type Props = {
	instances: any[],
}

const TimeLine: React.FC<Props> = ({ instances }) => {
	return (
		<View className="h-36 w-full mb-3 border border-custom-grey">
			<FlatList 
				data={instances}
				renderItem={({item}) => <TimeLineSlot type={item.type} data={item.data} /> }
				keyExtractor={(_, index) => index.toString()}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	)
}

export default TimeLine

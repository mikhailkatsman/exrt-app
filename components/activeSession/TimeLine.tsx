import { Dimensions, FlatList, View } from "react-native"
import TimeLineSlot from "./TimeLineSlot"

type Props = {
	instances: any[],
}

const TimeLine: React.FC<Props> = ({ instances }) => {
	const halfScreenWidth = (Dimensions.get('screen').width - 16) / 2

	return (
		<View className="h-36 w-full mb-3 border border-custom-grey">
			<FlatList 
				data={instances}
				renderItem={({item}) => <TimeLineSlot type={item.type} data={item.data} /> }
				keyExtractor={(_, index) => index.toString()}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				fadingEdgeLength={200}
			/>
			<View 
				className="w-24 border-x border-custom-red" 
				style={{
					position: 'absolute', 
					left: halfScreenWidth - 48,
					top: 0,
					bottom: 0
				}}
			/>
		</View>
	)
}

export default TimeLine

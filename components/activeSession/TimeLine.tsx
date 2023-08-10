import { FlatList, Text, View } from "react-native"
import TimeLineSlot from "./TimeLineSlot"

type Props = {
	instances: any[],
}

const TimeLine: React.FC<Props> = ({ instances }) => {
	return (
		<View className="h-36 w-full mb-3 border border-custom-grey">
			<FlatList 
				data={instances}
				renderItem={({item}) => 
					<TimeLineSlot
						isActive={true}
						name={item.name}
						style={item.style}
						thumbnail={item.thumbnail}
						sets={item.sets}
						reps={item.reps}
						minuteDuration={item.minuteDuration}
						secondDuration={item.secondDuration}
						weight={item.weight}
					/>
				}
				keyExtractor={item => item.id}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			/>

		</View>
	)
}

export default TimeLine

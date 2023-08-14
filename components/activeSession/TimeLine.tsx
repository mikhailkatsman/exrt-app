import { Dimensions, FlatList, View } from "react-native"
import { useRef, useEffect, useState } from 'react'
import TimeLineSlot from "./TimeLineSlot"

type Props = {
	instances: any[],
	currentActivityIndex: number
}

const TimeLine: React.FC<Props> = ({ instances, currentActivityIndex }) => {
	const halfScreenWidth = (Dimensions.get('screen').width - 16) / 2
	const flatListRef = useRef<FlatList>(null)
	const [isReady, setIsReady] = useState<boolean>(false)

	useEffect(() => {
		if (isReady) {
			const position: number = 
				((currentActivityIndex + 1) * 96) - 96
			flatListRef.current?.scrollToOffset({
				offset: position,
				animated: true,
			})
		}
	}, [currentActivityIndex, isReady])

	return (
		<View className="h-32 w-full mb-3">
			<View 
				className="w-24 border-x rounded-2xl border-custom-red" 
				style={{
					position: 'absolute', 
					left: halfScreenWidth - 48,
					top: 4,
					bottom: 4
				}}
			/>
			<FlatList 
				ref={flatListRef}
				data={instances}
				renderItem={({item}) => 
					<TimeLineSlot type={item.type} data={item.data} /> 
				}
				keyExtractor={(_, index) => index.toString()}
				horizontal={true}
				contentContainerStyle={{ 
					paddingHorizontal: halfScreenWidth - 48,
				}}
				showsHorizontalScrollIndicator={false}
				fadingEdgeLength={160}
				onContentSizeChange={() => setIsReady(true)}
			/>
		</View>
	)
}

export default TimeLine

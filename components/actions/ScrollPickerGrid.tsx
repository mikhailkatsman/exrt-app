import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import ScrollPicker from "../common/ScrollPicker";

type Props = {
  setInstanceSets: (value: number) => void,
  setInstanceReps: (value: number) => void,
  setInstanceWeight: (value: number) => void,
  setInstanceDuration: (value: string) => void,
  instanceDuration: string,
}

const ScrollPickerGrid: React.FC<Props> = ({
  setInstanceReps,
  setInstanceSets,
  setInstanceWeight,
  setInstanceDuration,
  instanceDuration
}) => {
  const [weighted, setWeighted] = useState<boolean>(false)
  const [timed, setTimed] = useState<boolean>(false)

  const setValues: number[] = useMemo(() => {
    const values = [];
    for (let i = 1; i <= 10; i++) values.push(i);
    return values;
  }, []);

  const repValues: number[] = useMemo(() => {
    const values = [];
    for (let i = 1; i <= 50; i++) values.push(i);
    return values;
  }, []);

  const kgValues: number[] = useMemo(() => {
    const values = [];
    for (let i = 0; i <= 100;) {
      values.push(i);
      if (i < 10) i += 0.25;
      else if (i < 20) i += 0.5;
      else if (i < 30) i++;
      else i += 10;
    }
    return values;
  }, []);

  const timeValues: string[] = useMemo(() => {
    const values = [];
    for (let i = 0; i <= 59; i++) values.push(i.toString().padStart(2, '0'));
    return values;
  }, []);

  return (
    <View className="h-48 w-full mb-6 px-2">
      <View className="h-[50%] w-full flex-row mb-3">
	<View className="flex-1 flex-row items-center justify-start">
	  <Text className="w-12 text-custom-white text-xl font-BaiJamjuree-Regular">Sets</Text>
	  <ScrollPicker 
	    dataArray={setValues} 
	    width={50} 
	    onIndexChange={(index: number) => setInstanceSets(setValues[index])}
	  />
	</View>
	  {weighted ? (
	    <View className="flex-1 flex-row items-center justify-end">
	      <Text className="text-custom-white text-xl font-BaiJamjuree-Regular">Weight</Text>
	      <ScrollPicker 
		dataArray={kgValues} 
		width={60}
		onIndexChange={(index: number) => setInstanceWeight(kgValues[index])}
	      />
	      <Text className="text-custom-white text-lg font-BaiJamjuree-Regular">kg</Text>
	    </View>
	  ) : (
	    <View className="flex-1 flex-row items-center justify-end">
	      <Pressable onPress={() => setWeighted(true)}>
		<Text className="text-custom-blue text-xl font-BaiJamjuree-Regular">Set Weight</Text>
	      </Pressable>
	    </View>
	  )}
      </View>
      <View className="h-[50%] w-full flex-row mb-2">
	<View className="flex-1 flex-row items-center justify-start">
	  <Text className="w-12 text-custom-white text-xl font-BaiJamjuree-Regular">Reps</Text>
	  <ScrollPicker 
	    dataArray={repValues} 
	    width={50} 
	    onIndexChange={(index: number) => setInstanceReps(repValues[index])}
	  />
	</View>
	{timed ? (
	  <View className="flex-1 flex-row items-center justify-end">
	    <Text className="text-custom-white text-xl mr-1 font-BaiJamjuree-Regular">Duration</Text>
	    <ScrollPicker 
	      dataArray={timeValues} 
	      width={40} 
	      onIndexChange={(index: number) => setInstanceDuration(timeValues[index] + instanceDuration.slice(2))}
	    />
	    <Text className="text-custom-white text-lg font-BaiJamjuree-Regular">m</Text>
	    <ScrollPicker 
	      dataArray={timeValues} 
	      width={40} 
	      onIndexChange={(index: number) => setInstanceDuration(instanceDuration.slice(0, 2) + timeValues[index])}
	    />
	    <Text className="text-custom-white text-lg font-BaiJamjuree-Regular">s</Text>
	  </View>
	) : (
	  <View className="flex-1 flex-row items-center justify-end">
	    <Pressable onPress={() => setTimed(true)}>
	      <Text className="text-custom-blue text-xl font-BaiJamjuree-Regular">Set Duration</Text>
	    </Pressable>
	  </View>
	)}
      </View>
    </View>
  )
}

export default ScrollPickerGrid

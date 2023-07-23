import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, Text, View, Animated } from 'react-native'

type Props = { 
  dataArray: number[] | string[], 
  width: number,
  onIndexChange: (index: number) => void
}

const ScrollPicker: React.FC<Props> = ({ dataArray, width, onIndexChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const itemHeight: number = 32
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollOffsetY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    onIndexChange(selectedIndex)
  }, [selectedIndex])

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y
    scrollOffsetY.setValue(offsetY)
    setSelectedIndex(Math.round(offsetY / itemHeight))
  };

  return (
    <View className="h-[96px] overflow-hidden" style={{ width: width }}>
      <ScrollView
        ref={scrollViewRef}
        onMomentumScrollEnd={handleScroll}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: 96 / 2 - itemHeight / 2 }}
      >
        {dataArray.map((item, index) => (
          <View key={index} className='h-8 justify-center items-center'>
            <Text className={selectedIndex === index 
              ? 'font-bold text-2xl text-custom-blue' 
              : 'text-lg text-custom-grey'}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ScrollPicker;

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Text, View, Animated, FlatList } from 'react-native'

type Props = { 
  dataArray: number[] | string[], 
  width: number,
  onIndexChange: (index: number) => void
}

const ScrollPicker: React.FC<Props> = ({ dataArray, width, onIndexChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const itemHeight: number = 28
  const flatListRef = useRef<FlatList>(null)
  const scrollOffsetY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    onIndexChange(selectedIndex)
  }, [selectedIndex])

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y
    scrollOffsetY.setValue(offsetY)
    setSelectedIndex(Math.round(offsetY / itemHeight))
  };

  const renderItem = useCallback(
    ({ item, index }: { item: number | string, index: number }) => {
      return (
        <View className='h-7 justify-center items-center'>
          <Text className={selectedIndex === index 
            ? 'font-BaiJamjuree-Bold text-xl text-custom-blue' 
            : 'font-BaiJamjuree-Light text-lg text-custom-grey'}
          >
            {item}
          </Text>
        </View>
      )
    }, [selectedIndex]
  )

  return (
    <View className="h-[84px] overflow-hidden" style={{ width: width }}>
      <FlatList
        data={dataArray}
        ref={flatListRef}
        renderItem={renderItem}
        onMomentumScrollEnd={handleScroll}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        getItemLayout={(_, index) => (
          {length: itemHeight, offset: itemHeight * index, index}
        )}
        ListHeaderComponent={<View style={{ height: 84 / 2 - itemHeight / 2 }} />}
        ListFooterComponent={<View style={{ height: 84 / 2 - itemHeight / 2 }} />}
        keyExtractor={(_, index) => index.toString()} 
      />
    </View>
  );
};

export default ScrollPicker;

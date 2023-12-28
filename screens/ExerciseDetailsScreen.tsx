import { View, TouchableOpacity, Text, ScrollView, Dimensions, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import Animated, { Easing, withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { Icon } from "@react-native-material/core"
import ScreenWrapper from "@components/common/ScreenWrapper"
import { muscleGroups, exerciseBackgrounds, videoFiles } from "@modules/AssetPaths"
import { useEffect, useRef, useState } from "react"
import DB from "@modules/DB"

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetails'>

const windowWidth = Dimensions.get('window').width - 16

const ExerciseDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const exerciseId = route.params.exerciseId

  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isTabPressed, setIsTabPressed] = useState<boolean>(false)
  const [exerciseData, setExerciseData] = useState<{
    name: string,
    type: string,
    style: string,
    difficulty: number,
    description: string,
    execution: string[],
    video: keyof typeof videoFiles,
    background: keyof typeof exerciseBackgrounds,
    custom: number
  }>({
    name: '',
    type: '',
    style: '',
    difficulty: 0,
    description: '',
    execution: [],
    video: '',
    background: '',
    custom: 0
  })
  const [exerciseMuscleGroups, setExerciseMuscleGroups] = useState<{
    name: string,
    group: number,
    load: number 
  }[]>([])

  const scrollRef = useRef<ScrollView>(null)

  const selectedTabAnim = useSharedValue(0)

  const selectedTabStyle = useAnimatedStyle(() => {
    const x = selectedTabAnim.value * (windowWidth - 20) / 3

    return { transform: [{ translateX: x }] }
  })

  const handleTabPress = (tabIndex: number) => {
    setIsTabPressed(true)
    selectedTabAnim.value = withTiming(tabIndex, { duration: 150, easing: Easing.out(Easing.exp) })
    setSelectedTab(tabIndex)

    scrollRef.current?.scrollTo({ x: tabIndex * windowWidth, animated: true })
    setTimeout(() => {
      setIsTabPressed(false)
    }, 250)
  }

  const handleHorizontalScroll = (event: any) => {
    if (isTabPressed) return

    const scrollPosition = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(scrollPosition / windowWidth)
    
    if (currentIndex !== selectedTab) {
      handleTabPress(currentIndex)
    }
  }

  const fetchMuscleGroups = () => {
    DB.sql(`
      SELECT emg.load AS muscleGroupLoad,
             mg.id AS muscleGroupId,
             mg.name AS muscleGroupName
      FROM exercise_muscle_groups emg
      LEFT JOIN muscle_groups mg
      ON emg.muscle_group_id = mg.id
      WHERE emg.exercise_id = ?;
    `, [exerciseId],
    (_, result) => {
      const muscleGroups = result.rows._array.map(item => {
        return {
          name: item.muscleGroupName,
          group: item.muscleGroupId,
          load: item.muscleGroupLoad
        }
      })
      setExerciseMuscleGroups(muscleGroups)
    })
  }

  const fetchExerciseData = () => {
    DB.sql(`
      SELECT * FROM exercises
      WHERE id = ?;
    `, [exerciseId],
    (_, result) => {
      const fetchedData = result.rows.item(0)
      setExerciseData({
        name: fetchedData.name,
        type: fetchedData.type,
        style: fetchedData.style,
        difficulty: fetchedData.difficulty,
        description: fetchedData.description,
        execution: fetchedData.execution.split('\n'),
        video: fetchedData.video,
        background: fetchedData.background,
        custom: fetchedData.custom
      })
    })
  }

  const renderMuscleNamesByLoad = (loadValue: number) => {
    const filteredArray = exerciseMuscleGroups.filter(muscle => muscle.load === loadValue)

    return <Text className="mb-8 text-custom-white font-BaiJamjuree-Bold capitalize">
      {filteredArray.map((muscle, index) => {
        return `${muscle.name}${index !== filteredArray.length - 1 ? ', ' : ''}`
      })} 
    </Text>
  }

  useEffect(() => {
    fetchMuscleGroups()
    fetchExerciseData()
  }, [])

  const renderDifficulty = () => {
    let difProps = {
      text: '',
      color: '#121212',
    }

    switch (exerciseData.difficulty) {
      case 1:
        difProps.text = 'Beginner'
        difProps.color = '#74AC5D'
        break
      case 2:
        difProps.text = 'Intermediate'
        difProps.color = '#5AABD6'
        break
      case 3:
        difProps.text = 'Advanced'
        difProps.color = '#F7EA40'
        break
      case 4:
        difProps.text = 'Expert'
        difProps.color = '#F34A00'
        break
      case 5:
        difProps.text = 'Master'
        difProps.color = '#F4533E'
    }

    return (
      <View className="flex flex-row mb-8">
        <Text 
          className="text-lg font-BaiJamjuree-Bold mr-3"
          style={{ color: difProps.color }}
        >
          {difProps.text}
        </Text>
        <View className="flex flex-row mt-1">
          {Array.from({length: 5}).map((_, index) => {
            if (index < exerciseData.difficulty) {
              return <Icon key={index} name="star" color={difProps.color} size={18} /> 
            } else {
              return <Icon key={index} name="star-outline" color="#505050" size={18} /> 
            }
          })}
        </View>
      </View>
    )
  }
  
  return (
    <ScreenWrapper>
      <View className="px-3 mb-8">
        <View className='w-2/3 -mt-1'>
          <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Name:</Text>
        </View>
        <Text className="text-custom-white text-xl font-BaiJamjuree-Bold capitalize">{exerciseData.name}</Text>
      </View>
      <View className='h-12 px-3 w-full mb-8 flex-row justify-between'>
        <Animated.View style={selectedTabStyle}>
          <View className='absolute h-full border-2 rounded-2xl border-custom-white' style={{ width: (windowWidth - 30) / 3 }} />
        </Animated.View>
        <TouchableOpacity 
          className='h-full w-1/3 justify-center items-center' 
          onPress={() => handleTabPress(0)}
          activeOpacity={1}
        >
          <Text className="text-custom-white font-BaiJamjuree-Bold">
            How-To
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className='h-full w-1/3 justify-center items-center' 
          onPress={() => handleTabPress(1)}
          activeOpacity={1}
        >
          <Text className="text-custom-white font-BaiJamjuree-Bold">
            Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className='h-full w-1/3 justify-center items-center' 
          onPress={() => handleTabPress(2)}
          activeOpacity={1}
        >
          <Text className="text-custom-white font-BaiJamjuree-Bold">
            Anatomy
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        ref={scrollRef}
        className='flex-1 mb-3'
        horizontal={true}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth}
        onScroll={handleHorizontalScroll}
        decelerationRate='fast'
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        overScrollMode="never"
        bounces={false}
      >
        <ScrollView 
          className='px-3'
          style={{ width: windowWidth }}
          fadingEdgeLength={100}
          showsVerticalScrollIndicator={false}
        >
          <Image
            className="h-96 w-full mb-8 rounded-2xl"
            resizeMode="cover"
            source={exerciseBackgrounds[exerciseData.background]} 
          />
          <TouchableOpacity
            className="absolute top-3 right-6"
            onPress={() => navigation.navigate('FullScreenVideo', { videoSource: exerciseData.video })}
          >
            <Icon name='video-outline' size={40} color="#F5F6F3" />
          </TouchableOpacity>
          <View className='w-2/3 -mt-1 mb-3'>
            <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Execution:</Text>
          </View>
          {exerciseData.execution.map((paragraph, index) => (
            <View key={index} className="w-full flex flex-row gap-3 mb-3">
              <Text className="w-[10%] pt-0.5 text-custom-red font-BaiJamjuree-Bold text-lg">{index + 1}</Text>
              <Text className="w-[80%] text-custom-white font-BaiJamjuree-Regular">{paragraph}</Text>
            </View>
          ))}
        </ScrollView>
        <ScrollView 
          className='px-3'
          style={{ width: windowWidth }}
          fadingEdgeLength={100}
          showsVerticalScrollIndicator={false}
        >
          <View className='w-2/3 -mt-1'>
            <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Difficulty:</Text>
          </View>
          {renderDifficulty()}
          <View className='w-2/3 -mt-1'>
            <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Type:</Text>
          </View>
          <Text className="mb-8 text-custom-white text-lg font-BaiJamjuree-Bold capitalize">{exerciseData.type}</Text>
          <View className='w-2/3 -mt-1'>
            <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Style:</Text>
          </View>
          <Text className="mb-8 text-custom-white text-lg font-BaiJamjuree-Bold capitalize">{exerciseData.style}</Text>
          <View className='w-2/3 -mt-1'>
            <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Description:</Text>
          </View>
          <Text className="mb-8 text-custom-white font-BaiJamjuree-Regular">{exerciseData.description}</Text>
        </ScrollView>
        <ScrollView 
          className='px-3'
          style={{ width: windowWidth }}
          fadingEdgeLength={100}
          showsVerticalScrollIndicator={false}
        >
          <View className="h-64 w-full mb-8 relative">
            <Image className="absolute w-full h-full" resizeMode="contain" 
              source={muscleGroups['base' as keyof typeof muscleGroups]}
            />
            {exerciseMuscleGroups.map((muscle, index) => {
              const fileName = `${muscle.group}-${muscle.load}` as keyof typeof muscleGroups
              return <Image key={index} className="absolute w-full h-full" resizeMode="contain" source={muscleGroups[fileName]} />
            })}
          </View>
          <View className='w-2/3 -mt-1'>
            <Text className="font-BaiJamjuree-BoldItalic" style={{ color: '#d30000' }}>Activators:</Text>
          </View>
          {renderMuscleNamesByLoad(3)}
          <View className='w-2/3 -mt-1'>
            <Text className="font-BaiJamjuree-BoldItalic" style={{ color: '#f34a00' }}>Assistive:</Text>
          </View>
          {renderMuscleNamesByLoad(2)}
          <View className='w-2/3 -mt-1'>
            <Text className="font-BaiJamjuree-BoldItalic" style={{ color: '#f4a816' }}>Stabilizers:</Text>
          </View>
          {renderMuscleNamesByLoad(1)}
        </ScrollView>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default ExerciseDetailsScreen

import { View, TouchableOpacity, Text, TextInput, Dimensions, ImageBackground, BackHandler } from 'react-native'
import { useState, useEffect, useCallback, useRef } from "react"
import Animated, { Easing, withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "@react-native-material/core"
import { HeaderBackButton } from '@react-navigation/elements'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { type NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import PhaseCard from "@components/common/PhaseCard"
import { programThumbnails } from "@modules/AssetPaths"
import { ScrollView } from 'react-native-gesture-handler'

type Props = NativeStackScreenProps<RootStackParamList, 'EditProgram'>

const windowWidth = Dimensions.get('window').width - 16

const EditProgramScreen: React.FC<Props> = ({ navigation, route }) => {
  const programId: number = route.params.programId
  const newProgram: boolean = route.params.newProgram
  
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [dirPath, setDirPath] = useState<string>('')
  const [cachePath, setCachePath] = useState<string>('')
  const [name, setName] = useState<string>('My Custom Program 1')
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isTabPressed, setIsTabPressed] = useState<boolean>(false)
  const [description, setDescription] = useState<string>('No description provided.')
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [isEditableProgramName, setIsEditableProgramName] = useState<boolean>(false)
  const [isEditableDescription, setIsEditableDescription] = useState<boolean>(false)
  const [thumbnail, setThumbnail] = useState<string>('program_thumbnail_placeholder')
  const [difficulty, setDifficulty] = useState<number>(1)
  const [type, setType] = useState<string>('')
  const [ogThumbnailPath, setOgThumbnailPath]= useState<string>(thumbnail)
  const [status, setStatus] = useState<string>('')
  const [custom, setCustom] = useState<boolean>(false)
  const [phases, setPhases] = useState<any[]>([])
  
  const programNameInputRef = useRef<TextInput>(null)
  const descriptionInputRef = useRef<TextInput>(null)
  const scrollRef = useRef<ScrollView>(null)

  const selectedTabAnim = useSharedValue(0)
  const selectedTabStyle = useAnimatedStyle(() => {
    const x = selectedTabAnim.value * (windowWidth - 20) / 2

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

  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    })

    if (!result.canceled) {
      const resultfileName = result.assets[0].uri.split('/').pop()
      const tempFileUri = cachePath + resultfileName 
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: tempFileUri,
      })

      setThumbnail(tempFileUri)
    }
  }

  const saveThumbnailImage = async() => {
    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true })
    const newThumbnailPath = dirPath + thumbnail.split('/').pop() 

    await FileSystem.copyAsync({
      from: thumbnail,
      to: newThumbnailPath,
    })

    if (ogThumbnailPath !== 'program_thumbnail_placeholder') {
      await FileSystem.deleteAsync(ogThumbnailPath, { idempotent: true })
    }
    
    return newThumbnailPath
  }

  const clearImageCache = async() => {
    let cache = await FileSystem.readDirectoryAsync(cachePath)

    for (const file of cache) {
      await FileSystem.deleteAsync(`${cachePath}${file}`, { idempotent: true })
    }

    cache = await FileSystem.readDirectoryAsync(cachePath)
  }

  const registerProgram = async() => {
    if (phases.length === 0) {
      navigation.navigate('ErrorModal', { 
        title: 'No Phases Added', 
        message: 'Please add at least one phase to this program.'
      })
      return
    }

    let newThumbnailPath = thumbnail

    if (thumbnail !== 'program_thumbnail_placeholder' 
      && thumbnail !== ogThumbnailPath) {
      newThumbnailPath = await saveThumbnailImage()
      await clearImageCache()
    }

    DB.sql(`
      UPDATE programs
      SET name = ?,
          description = ?,
          thumbnail = ?
      WHERE id = ?;
    `, [name, description, newThumbnailPath, programId], 
    () => navigation.pop())
  }

  const deleteProgram = async() => {
    DB.transaction(tx => {
      tx.executeSql(`
        DELETE FROM exercise_instances
        WHERE id IN (
          SELECT sei.exercise_instance_id
          FROM session_exercise_instances sei
          JOIN sessions s ON s.id = sei.session_id
          JOIN phase_session_instances psi ON psi.session_id = s.id
          JOIN program_phases pp ON pp.phase_id = psi.phase_id
          WHERE pp.program_id = ?
        );
      `, [programId])

      tx.executeSql(`
        DELETE FROM session_exercise_instances
        WHERE session_id IN (
          SELECT s.id 
          FROM sessions s
          JOIN phase_session_instances psi ON psi.session_id = s.id
          JOIN program_phases pp ON pp.phase_id = psi.phase_id
          WHERE pp.program_id = ?
        );
      `, [programId])

      tx.executeSql(`
        DELETE FROM sessions
        WHERE id IN (
          SELECT s.id 
          FROM sessions s
          JOIN phase_session_instances psi ON psi.session_id = s.id
          JOIN program_phases pp ON pp.phase_id = psi.phase_id
          WHERE pp.program_id = ?
        );
      `, [programId])

      tx.executeSql(`
        DELETE FROM phase_session_instances
        WHERE phase_id IN (
          SELECT phase_id
          FROM program_phases
          WHERE program_id = ?
        );
      `, [programId])

      tx.executeSql(`
        DELETE FROM phases
        WHERE id IN (
          SELECT phase_id
          FROM program_phases
          WHERE program_id = ?
        );
      `, [programId])

      tx.executeSql(`
        DELETE FROM program_phases
        WHERE program_id = ?;
      `, [programId])

      tx.executeSql(`
        DELETE FROM programs
        WHERE id = ?;
      `, [programId])
    },
      error => console.log('Error deleting program from DB: ' + error),
      () => {
        if (thumbnail !== 'program_thumbnail_placeholder') {
          FileSystem.deleteAsync(ogThumbnailPath).then(() => navigation.pop())
          return
        }

        navigation.pop()
      }
    )
  }

  const onBackPressed = () => {
    if (custom) {
      if (newProgram) {
        navigation.navigate('DismissModal', {
          onConfirm: () => {
            if (thumbnail !== 'program_thumbnail_placeholder') {
              clearImageCache().then(() => deleteProgram())
              return
            }

            deleteProgram()
          },
        })
      } else {
        if (phases.length === 0) {
          navigation.navigate('ErrorModal', { 
            title: 'No Phases Added', 
            message: 'Please add at least one phase to this program or delete the program.'
          })
          return
        } else {
          navigation.navigate('DismissModal', {
            onConfirm: () => {
              if (thumbnail !== 'program_thumbnail_placeholder') {
                clearImageCache().then(() => navigation.pop())
                return
              }

              navigation.pop()
            },
          })
        }
      }
    } else {
      navigation.pop()
    }
  }

  const handleNamePress = () => {
    setIsEditableProgramName(true)
  }

  const handleDescriptionPress = () => {
    setIsEditableDescription(true)
  }

  useEffect(() => {
    if (isEditableProgramName && programNameInputRef.current) {
      programNameInputRef.current?.focus()
    }

    if (isEditableDescription && descriptionInputRef.current) {
      descriptionInputRef.current?.focus()
    }
  }, [isEditableProgramName, isEditableDescription])

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        onBackPressed()
        return true
      })
    }, [])
  )

  const fetchPhases = () => {
    DB.sql(`
      SELECT phases.id AS phaseId,
             phases.name AS phaseName,
             phases.custom AS phaseCustom,
             phases.status AS phaseStatus
      FROM program_phases
      JOIN phases ON program_phases.phase_id = phases.id
      WHERE program_phases.program_id = ?
      ORDER BY program_phases.phase_order ASC;
    `, [programId],
    (_, result) => {
      const phaseDetails: any[] = []
      result.rows._array.forEach(item => {
        phaseDetails.push({
          phaseId: item.phaseId,
          phaseName: item.phaseName,
          phaseCustom: item.phaseCustom,
          phaseStatus: item.phaseStatus,
        })
      })

      setPhases(phaseDetails)
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          style={{ marginLeft: -4, marginRight: 30 }}
          onPress={onBackPressed}
        />      
      ),
      headerRight: () => (
        custom ?
          <TouchableOpacity 
            className="flex-row items-start justify-end"
            onPress={() => setIsEditable(prev => !prev)}
          >
            {isEditable ?
              <Icon name="pencil-remove" color="#F5F6F3" size={22} /> 
            : 
              <Icon name="pencil" color="#F5F6F3" size={22} /> 
            }
          </TouchableOpacity>
        : null
      )
    })
  }, [phases, custom, isEditable])

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchPhases)

    setDirPath(FileSystem.documentDirectory + 'images/programs/')
    setCachePath(FileSystem.cacheDirectory + 'thumbnails/')

    DB.sql(`
      SELECT name AS name,
             description AS description,
             thumbnail AS thumbnail,
             difficulty AS difficulty,
             type AS type,
             status AS status,
             custom AS custom
      FROM programs
      WHERE id = ?;
    `, [programId], 
    (_, result) => {
      const item = result.rows.item(0)
      setName(item.name)
      setDescription(item.description)
      setThumbnail(item.thumbnail)
      setOgThumbnailPath(item.thumbnail)
      setDifficulty(item.difficulty)
      setType(item.type)
      setStatus(item.status)
      setCustom(() => item.custom === 1 ? true : false)
      setIsLoaded(true)
    })

    if (newProgram) setIsEditable(true)

    return () => {
      unsubscribeFocus()
    }
  }, [])

  if (!isLoaded) return <View className='flex-1 bg-custom-dark'/>

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <ImageBackground
          className="w-full mb-5 rounded-2xl overflow-hidden"
          style={{ height: (windowWidth * 9) / 16 }}
          resizeMode="cover" 
          source={
            programThumbnails[thumbnail as keyof typeof programThumbnails] || 
            {uri: thumbnail}
          } 
        >
          <LinearGradient 
            className="absolute h-full w-full"
            colors={['rgba(18, 18, 18, 1)', 'transparent']}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
          />
          <View className="h-full w-full p-3 flex-col justify-between items-end">
            <View className='w-full flex-col justify-between'>
              <View className='w-full flex-row justify-between items-center'>
                <View className='w-2/3 -mt-2'>
                  <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Program Name:</Text>
                </View>
                {isEditable ?
                  <TouchableOpacity 
                    className="w-1/3 h-8 flex-row items-start justify-end"
                    onPress={handleNamePress}
                  >
                    <Icon name="pencil" color="#F5F6F3" size={22} /> 
                  </TouchableOpacity>
                : <View className='w-1/3 h-8' />
                }
              </View>
              <TextInput
                ref={programNameInputRef}
                onChangeText={setName}
                className="w-[90%] text-custom-white text-xl font-BaiJamjuree-Bold capitalize"
                autoCapitalize="words"
                defaultValue={name}
                selectionColor="#F5F6F3"
                editable={isEditableProgramName}
                onSubmitEditing={() => setIsEditableProgramName(false)}
              />
            </View>
            {isEditable &&
              <TouchableOpacity 
                onPress={pickImage}
              >
                <Icon name="image-edit" color="#F5F6F3" size={28} /> 
              </TouchableOpacity>
            }
          </View>
        </ImageBackground>
        <View className='h-12 px-3 w-full mb-8 flex-row justify-between'>
          <Animated.View style={selectedTabStyle}>
            <View className='absolute h-full border-2 rounded-2xl border-custom-white' style={{ width: (windowWidth - 20) / 2 }} />
          </Animated.View>
          <TouchableOpacity 
            className='h-full pt-1 w-1/2 justify-center items-center' 
            onPress={() => handleTabPress(0)}
            activeOpacity={1}
          >
            <Text className="text-custom-white text-lg font-BaiJamjuree-Bold">
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className='h-full pt-1 w-1/2 justify-center items-center' 
            onPress={() => handleTabPress(1)}
            activeOpacity={1}
          >
            <Text className="text-custom-white text-lg font-BaiJamjuree-Bold">
              Phases
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          ref={scrollRef}
          className='flex-1'
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
            <View className="flex-row justify-between">
              <View className='w-2/3 -mt-1'>
                <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Type:</Text>
              </View>
              {isEditable ?
                <TouchableOpacity 
                  className="w-1/3 h-8 flex-row items-start justify-end"
                  onPress={handleDescriptionPress}
                >
                  <Icon name="pencil" color="#F5F6F3" size={22} /> 
                </TouchableOpacity>
              : <View className='w-1/3 h-8' />
              }
            </View>
            <Text className="flex-1 mb-8 text-custom-white text-lg font-BaiJamjuree-Bold capitalize">
              {type === 'fullbody'
                ? 'full-body hypertrophy training'
                : type === 'skills'
                ? 'specific skill training'
                : type === 'mobility'
                ? 'mobility & flexibility training'
                : type === 'endurance'
                ? 'endurance training'
                : 'Unspecified'
              }
            </Text>
            <View className="flex-row justify-between">
              <View className='w-2/3 -mt-1'>
                <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Difficulty:</Text>
              </View>
              {isEditable ?
                <TouchableOpacity 
                  className="w-1/3 h-8 flex-row items-start justify-end"
                  onPress={handleDescriptionPress}
                >
                  <Icon name="pencil" color="#F5F6F3" size={22} /> 
                </TouchableOpacity>
              : <View className='w-1/3 h-8' />
              }
            </View>
              {difficulty === 1
                ? <Text className="flex-1 mb-8 text-custom-blue text-lg font-BaiJamjuree-Bold">Beginner</Text>
                : difficulty === 2
                ? <Text className="flex-1 mb-8 text-custom-yellow text-lg font-BaiJamjuree-Bold">Intermediate</Text>
                : difficulty === 3
                ? <Text className="flex-1 mb-8 text-custom-red text-lg font-BaiJamjuree-Bold">Expert</Text>
                : <Text className="flex-1 mb-8 text-custom-red text-lg font-BaiJamjuree-Bold">Unspecified</Text>
              }
            <View className="flex-row justify-between">
              <View className='w-2/3 -mt-1'>
                <Text className="text-custom-grey font-BaiJamjuree-MediumItalic">Description:</Text>
              </View>
              {isEditable ?
                <TouchableOpacity 
                  className="w-1/3 h-8 flex-row items-start justify-end"
                  onPress={handleDescriptionPress}
                >
                  <Icon name="pencil" color="#F5F6F3" size={22} /> 
                </TouchableOpacity>
              : <View className='w-1/3 h-8' />
              }
            </View>
            <TextInput
              ref={descriptionInputRef}
              onChangeText={setDescription}
              className="flex-1 mb-16 text-custom-white font-BaiJamjuree-Regular"
              defaultValue={description}
              selectionColor="#F5F6F3"
              editable={isEditableDescription}
              multiline
            />
            {isEditableDescription && 
              <View className="h-16 my-3">
                <TouchableOpacity className="
                  flex-1 border-2 border-custom-white rounded-2xl 
                  flex-row justify-center items-center"
                  onPress={() => setIsEditableDescription(false)}
                >
                  <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Confirm Description</Text>
                  <Icon name="plus" size={24} color="#F5F6F3" />
                </TouchableOpacity>
              </View>
            }
          </ScrollView>
          <View
            style={{ width: windowWidth }}
          >
            <ScrollView
              className='px-3 w-full'
              style={{ width: windowWidth }}
              fadingEdgeLength={100}
              showsVerticalScrollIndicator={false}
            >
              {phases.map((item, index) => (
                <PhaseCard
                  key={`card-${index}`}
                  id={item.phaseId}
                  name={item.phaseName}
                  custom={item.phaseCustom}
                  status={item.phaseStatus}
                />
              ))}
            </ScrollView>
            {isEditable &&
              <View className="h-16">
                <TouchableOpacity className="
                  flex-1 border-2 border-custom-white rounded-2xl 
                  flex-row justify-center items-center"
                  onPress={() => navigation.navigate("SetPhaseNameModal", { programId: programId })}
                >
                  <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Add New Phase</Text>
                  <Icon name="plus" size={24} color="#F5F6F3" />
                </TouchableOpacity>
              </View>
            }
          </View>
        </ScrollView>
      </View>
      {isEditable &&
        <BottomBarWrapper>
          <TouchableOpacity 
            className="w-[30%] rounded-2xl border-2 border-custom-red flex-row justify-center items-center"
            onPress={() => {
              navigation.navigate('ConfirmModal', {
                text: 'Are you sure you want to delete this program?',
                onConfirm: deleteProgram
              })
            }}
            activeOpacity={1}
          >
            <Text className="mr-2 text-custom-red font-BaiJamjuree-Bold">Delete</Text>
            <Icon name="delete-outline" size={20} color="#F4533E" />
          </TouchableOpacity>
          <View className="w-3" />
          <TouchableOpacity className="
            flex-1 border-2 border-custom-blue
            flex-row items-center justify-center 
            rounded-2xl"
            onPress={registerProgram}
          >
            <Text className="text text-custom-blue mr-2 font-BaiJamjuree-Bold">
              Confirm Program
            </Text>
            <Icon name="check" color="#5AABD6" size={22} /> 
          </TouchableOpacity>
        </BottomBarWrapper>
      }
    </ScreenWrapper>
  )
}

export default EditProgramScreen

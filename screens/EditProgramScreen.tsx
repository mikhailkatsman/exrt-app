import { View, TouchableOpacity, Text, TextInput, Dimensions, ImageBackground, BackHandler } from 'react-native'
import { useState, useEffect, useCallback } from "react"
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
  const programId: number | undefined = route.params.programId
  
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false)
  const [expandText, setExpandText] = useState<boolean>(false)
  const [dirPath, setDirPath] = useState<string>('')
  const [cachePath, setCachePath] = useState<string>('')
  const [name, setName] = useState<string>('My Custom Program 1')
  const [description, setDescription] = useState<string>('No description provided.')
  const [thumbnail, setThumbnail] = useState<string>("program_thumbnail_placeholder")
  const [ogThumbnailPath, setOgThumbnailPath]= useState<string>(thumbnail)
  const [status, setStatus] = useState<string>('')
  const [phases, setPhases] = useState<any[]>([])

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
          phaseStatus: item.phaseStatus,
        })
      })

      setPhases(phaseDetails)
    })
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', fetchPhases)

    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          style={{ marginLeft: -4, marginRight: 30 }}
          onPress={onBackPressed}
        />      
      )
    })

    setDirPath(FileSystem.documentDirectory + 'images/programs/')
    setCachePath(FileSystem.cacheDirectory + 'thumbnails/')

    DB.sql(`
      SELECT name AS name,
             description AS description,
             thumbnail AS thumbnail,
             status AS status
      FROM programs
      WHERE id = ?;
    `, [programId], 
    (_, result) => {
      const item = result.rows.item(0)
      setName(item.name)
      setDescription(item.description)
      setThumbnail(item.thumbnail)
      setOgThumbnailPath(item.thumbnail)
      setStatus(item.status)
    })

    return () => {
      unsubscribeFocus()
    }
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <ImageBackground
          className="w-full mb-5 rounded-xl overflow-hidden"
          style={{ height: (windowWidth * 9) / 16 }}
          resizeMode="center" 
          source={
            programThumbnails[thumbnail as keyof typeof programThumbnails] || 
            {uri: thumbnail}
          } 
        >
          <LinearGradient 
            className="absolute h-full w-full"
            colors={['rgba(0,0,0,0.7)', 'transparent']}
          />
          <View className="h-full w-full p-3 flex-col justify-between items-end">
            {isEditingName ? 
              <TextInput 
                onChangeText={setName}
                onSubmitEditing={() => setIsEditingName(false)}
                className="w-full text-custom-white text-xl font-BaiJamjuree-Bold"
                autoCapitalize="words"
                defaultValue={name}
                autoFocus={true}
              />
            : 
              <TouchableOpacity
                className="w-full"
                onPress={() => setIsEditingName(true)}
              >
                <View className='w-full mb-1 flex-row justify-between items-center'>
                  <View className='w-5/6 -mt-1'>
                    <Text className="text-custom-white font-BaiJamjuree-MediumItalic">Program Name:</Text>
                  </View>
                  <View className="w-1/6 h-full flex-row items-start justify-end">
                    <Icon name="pencil" color="#F5F6F3" size={22} /> 
                  </View>
                </View>
                <Text className="text-custom-white text-2xl font-BaiJamjuree-Bold">{name}</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity 
              onPress={pickImage}
            >
              <Icon name="image-edit" color="#F5F6F3" size={28} /> 
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <ScrollView 
          className='mb-3 px-3'
          fadingEdgeLength={100}
        >
          <View className=" w-full flex-row justify-between">
            <Text className="flex-1 text-custom-white font-BaiJamjuree-MediumItalic">Description:</Text>
            {!isEditingDescription &&
              <TouchableOpacity
                className="w-1/6 flex-row items-start justify-end"
                onPress={() => setIsEditingDescription(true)}
              >
                <Icon name="pencil" color="#F5F6F3" size={22} /> 
              </TouchableOpacity>
            }
          </View>
          {isEditingDescription ? 
            <TextInput 
              onChangeText={setDescription}
              onSubmitEditing={() => setIsEditingDescription(false)}
              className="w-full text-custom-white font-BaiJamjuree-Light"
              autoCapitalize="sentences"
              defaultValue={description}
              autoFocus={true}
              multiline={true}
            />
          :
            <TouchableOpacity
              activeOpacity={1}
              className='mb-5'
              onPress={() => setExpandText(prev => !prev)}
            >
              <Text className={`
                mb-1 text-custom-white font-BaiJamjuree-Light
                ${expandText ? 'flex-1' : 'h-20'}
              `}>
                {description}
              </Text>
              {expandText ? (
                <View className='flex-row justify-center items-center'>
                  <Text className='mr-2 font-BaiJamjuree-BoldItalic text-custom-white text-xs'>Less</Text>
                  <Icon name='chevron-up' size={22} color='#F5F6F3' />
                </View>
              ) : (
                <View className='flex-row justify-center items-center'>
                  <Text className='mr-2 font-BaiJamjuree-BoldItalic text-custom-white text-xs'>More</Text>
                  <Icon name='chevron-down' size={22} color='#F5F6F3' />
                </View>
              )}
            </TouchableOpacity>
          }
          <View className="flex-1">
            <Text className="mb-3 text-custom-white font-BaiJamjuree-MediumItalic">
              {phases.length} {phases.length !== 1 ? 'Phases' : 'Phase'}:
            </Text>
            {phases.map((item, index) => (
              <PhaseCard
                key={`card-${index}`}
                id={item.phaseId}
                name={item.phaseName}
                status={item.phaseStatus}
              />
            ))}
          </View>
        </ScrollView>
        {(!isEditingName && !isEditingDescription) &&
          <View className="h-16">
            <TouchableOpacity className="
              flex-1 border-2 border-custom-white rounded-xl 
              flex-row justify-center items-center"
              onPress={() => navigation.navigate("SetPhaseNameModal", { programId: programId })}
            >
              <Text className="text-custom-white mr-3 font-BaiJamjuree-Bold">Add New Phase</Text>
              <Icon name="plus" size={24} color="#F5F6F3" />
            </TouchableOpacity>
          </View>
        }
      </View>
      {(!isEditingName && !isEditingDescription) &&
        <BottomBarWrapper>
          <TouchableOpacity 
            className="w-[30%] rounded-xl border-2 border-custom-red flex-row justify-center items-center"
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
            rounded-xl"
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

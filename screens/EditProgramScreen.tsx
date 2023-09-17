import { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, TextInput, Dimensions, ImageBackground, FlatList } from 'react-native'
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "@react-native-material/core"
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import PhaseCard from "@components/common/PhaseCard"
import { programThumbnails } from "@modules/AssetPaths"

type Props = NativeStackScreenProps<RootStackParamList, 'EditProgram'>

const windowWidth = Dimensions.get('window').width - 16

const EditProgramScreen: React.FC<Props> = ({ navigation, route }) => {
  const programId: number | undefined = route.params?.programId
  
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false)
  const [name, setName] = useState<string>('My Custom Program 1')
  const [description, setDescription] = useState<string>('No description provided.')
  const [thumbnail, setThumbnail] = useState<string>("program_thumbnail_placeholder")
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
      if (thumbnail !== 'program_thumbnail_placeholder') {
        await FileSystem.deleteAsync(thumbnail, { idempotent: true })
      }

      const resultUri = result.assets[0].uri
      const fileName = resultUri.split('/').pop()
      const folderPath = FileSystem.documentDirectory + 'images/programs/'
      const newFileUri = folderPath + fileName

      //DEBUG DELETE ALL IMAGES
      //const initfiles = await FileSystem.readDirectoryAsync(folderPath)
      //for (const file of initfiles) {
      //  await FileSystem.deleteAsync(`${folderPath}${file}`)
      //}

      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + 'images/programs/', 
        { intermediates: true }
      )

      await FileSystem.copyAsync({
        from: resultUri,
        to: newFileUri,
      })

      setThumbnail(newFileUri)
      
      if (programId) {
        DB.sql(`
          UPDATE programs
          SET thumbnail = ?
          WHERE id = ?;
        `, [newFileUri, programId]) 
      }

      // DEBUG
      const files = await FileSystem.readDirectoryAsync(folderPath)
      console.log('Directory Content:', files)
    }
  }

  const registerProgram = async() => {
    if (!programId) {
      DB.sql(`
        INSERT INTO programs (name, description, thumbnail, status)
        VALUES (?, ?, ?, ?);
      `, [name, description, thumbnail, 'active'],
      () => navigation.pop())
      return
    }

    navigation.pop()
  }

  const deleteProgram = async() => {
    DB.transaction(tx => {
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
          FileSystem.deleteAsync(thumbnail, {idempotent: true}).then(() => navigation.pop())
          return
        }

        navigation.pop()
      }
    )
  }

  useEffect(()=> {
    if (!programId) {
      DB.sql(`
        SELECT name
        FROM programs
        WHERE name LIKE 'My Custom Program %'
        ORDER BY CAST(SUBSTR(name, LENGTH('My Custom Program ') + 1) AS INTEGER) DESC
        LIMIT 1;
      `, [],
      (_, result) => {
        if (result.rows.length !== 0) {
          const currentName = result.rows.item(0).name
          const currentNumber = parseInt(currentName.replace('My Custom Program ', ''))
          const newName = 'My Custom Program ' + (currentNumber + 1)
          setName(newName)
        }
      })
    } else {
      DB.transaction(tx => {
        tx.executeSql(`
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
          setStatus(item.status)
        })

        tx.executeSql(`
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
      })
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
                onSubmitEditing={() => {
                  DB.sql(`
                    UPDATE programs
                    SET name = ?
                    WHERE id = ?;
                  `, [name, programId], 
                  () => setIsEditingName(false))
                }}
                className="w-full text-custom-white text-xl font-BaiJamjuree-Bold"
                autoCapitalize="words"
                defaultValue={name}
                autoFocus={true}
              />
            : 
              <TouchableOpacity
                className="w-full flex-row justify-between items-center"
                onPress={() => setIsEditingName(true)}
              >
                <Text className="w-5/6 text-custom-white text-xl font-BaiJamjuree-Bold">
                  {name}
                </Text>
                <View className="w-1/6 h-full flex-row items-start justify-end">
                  <Icon name="pencil" color="#F5F6F3" size={22} /> 
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity 
              onPress={pickImage}
            >
              <Icon name="image-edit" color="#F5F6F3" size={28} /> 
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View className="px-3 mb-3 flex-1">
          <View className="w-full flex-row justify-between">
            <Text className="flex-1 text-custom-white font-BaiJamjuree-Bold">Description:</Text>
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
              onSubmitEditing={() => {
                DB.sql(`
                  UPDATE programs
                  SET description = ?
                  WHERE id = ?;
                `, [description, programId], 
                () => setIsEditingDescription(false))
                }}
              className="w-full text-custom-white font-BaiJamjuree-Light"
              autoCapitalize="sentences"
              defaultValue={description}
              autoFocus={true}
              multiline={true}
            />
          :
            <Text className="text-custom-white font-BaiJamjuree-Light">{description}</Text>
          }
        </View>
        <View className="px-3 flex-1">
          <Text className="mb-3 text-custom-white font-BaiJamjuree-Bold">Phases:</Text>
          <FlatList 
            data={phases}
            keyExtractor={(item: any) => item.phaseId}
            renderItem={({item}) => 
              <PhaseCard
                id={item.phaseId}
                name={item.phaseName}
                status={item.phaseStatus}
              />
            }
            fadingEdgeLength={200}
          />
        </View>
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

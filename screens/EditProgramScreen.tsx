import { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, TextInput, Dimensions, ImageBackground, FlatList } from 'react-native'
import { Icon } from "@react-native-material/core"
import * as ImagePicker from 'expo-image-picker'
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
  const [phases, setPhases] = useState<any[]>([])

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
        // Fetch program data
        tx.executeSql(`
          SELECT name AS name,
                 description AS description,
                 thumbnail AS thumbnail
          FROM programs
          WHERE id = ?;
        `, [programId], 
        (_, result) => {
          const item = result.rows.item(0)
          setName(item.name)
          setDescription(item.description)
          setThumbnail(item.thumbnail)
        })

        // Fetch all program related phases
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

  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    })

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri)
    }
  }

  const registerProgram = () => {
    console.log(`Data to be passed to DB: ${name}, ${description}, ${thumbnail}`)
    // TODO: check all names in existing programs if exists before insert
    DB.sql(`
      INSERT INTO programs (name, description, thumbnail, status)
      VALUES (?, ?, ?, ?);
    `, [name, description, thumbnail, 'subscribed'],
    () => navigation.pop())
  }

  const deleteProgram = () => {

  }

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <ImageBackground
          className="w-full mb-4 rounded-xl overflow-hidden"
          style={{ height: (windowWidth * 9) / 16 }}
          resizeMode="center" 
          source={programThumbnails[thumbnail as keyof typeof programThumbnails]} 
        >
          <View className="h-full w-full p-3 flex-col justify-between items-end">
            {isEditingName ? 
              <TextInput 
                onChangeText={setName}
                onSubmitEditing={() => setIsEditingName(false)}
                className="w-full text-custom-white text-xl font-BaiJamjuree-Bold"
                autoCapitalize="words"
                maxLength={20}
                defaultValue={name}
                autoFocus={true}
              />
              : 
              <TouchableOpacity
                className="w-full flex-row justify-between items-center"
                onPress={() => setIsEditingName(true)}
              >
                <Text className="text-custom-white text-xl font-BaiJamjuree-Bold">
                  {name}
                </Text>
                <Icon name="pencil" color="#F5F6F3" size={22} /> 
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
          <Text className="text-custom-white font-BaiJamjuree-Bold">Description:</Text>
          {isEditingDescription ? 
            <TextInput 
              onChangeText={setDescription}
              onSubmitEditing={() => setIsEditingDescription(false)}
              className="w-full text-custom-white font-BaiJamjuree-Light"
              autoCapitalize="sentences"
              defaultValue={description}
              autoFocus={true}
            />
          :
            <TouchableOpacity
              className="w-full flex-row justify-between items-start"
              onPress={() => setIsEditingDescription(true)}
            >
              <Text className="text-custom-white font-BaiJamjuree-Light">{description}</Text>
              <Icon name="pencil" color="#F5F6F3" size={22} /> 
            </TouchableOpacity>
          }
        </View>
        <View className="px-3 h-80">
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
    </ScreenWrapper>
  )
}

export default EditProgramScreen

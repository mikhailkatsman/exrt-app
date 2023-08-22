import { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, TextInput, Image, Dimensions } from 'react-native'
import { Icon } from "@react-native-material/core"
import * as ImagePicker from 'expo-image-picker'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import { programThumbnails } from "@modules/AssetPaths"

type Props = NativeStackScreenProps<RootStackParamList, 'EditProgram'>

const windowWidth = Dimensions.get('window').width - 16

const NewProgramScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>('My Custom Program 1')
  const [description, setDescription] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<string>("program_thumbnail_placeholder")

  useEffect(()=> {
    DB.transaction(tx => {
      tx.executeSql(`
        SELECT name
        FROM programs
        WHERE name LIKE 'My Custom Program %'
        ORDER BY CAST(SUBSTR(name, LENGTH('My Custom Program ') + 1) AS INTEGER) DESC
        LIMIT 1;
      `, [],
      (_, result) => {
        if (result.rows.length !== 0) {
          const currentName = result.rows.item(0).name
          console.log(currentName)
          const currentNumber = parseInt(currentName.replace('My Custom Program ', ''))
          const newName = 'My Custom Program ' + (currentNumber + 1)
          console.log(newName)
          setName(newName)
        }
      },
    )})
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

    DB.transaction(tx => {
      tx.executeSql(`
        INSERT INTO programs (name, description, thumbnail)
        VALUES (?, ?, ?);
      `, [name, description, thumbnail],
      (_, result) => {
        console.log('registering program')
        const programId: number = result.insertId ?? 666
        navigation.navigate('EditProgram', { programId: programId })
      })
    })
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 mb-3">
        <Text className="text-custom-white">Name:</Text>
        <TextInput 
          onChangeText={setName}
          className="text-custom-white"
          underlineColorAndroid="#ffffff"
        />
        <Image
          className="w-full rounded-xl"
          style={{ height: (windowWidth * 9) / 16 }}
          resizeMode="center" 
          source={programThumbnails[thumbnail as keyof typeof programThumbnails]} 
        />
        <TouchableOpacity 
          onPress={pickImage}
        >
          <Text className="text-custom-white">Pick Image</Text>
        </TouchableOpacity>
        <Text className="text-custom-white">Description:</Text>
        <TextInput 
          onChangeText={setDescription}
          className="text-custom-white"
          underlineColorAndroid="#ffffff"
        />
      </View>
      <BottomBarWrapper>
        <TouchableOpacity className="
          flex-1 border-2 border-custom-blue
          flex-row items-center justify-center 
          rounded-xl"
          onPress={registerProgram}
        >
          <Text className="text-xs text-custom-blue mr-2 font-BaiJamjuree-Bold">Create Your Program</Text>
          <Icon name="swap-horizontal" color="#5AABD6" size={24} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default NewProgramScreen

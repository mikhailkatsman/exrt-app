import { useState } from "react"
import { View, TouchableOpacity, Text, TextInput, Image } from 'react-native'
import { Icon } from "@react-native-material/core"
import * as ImagePicker from 'expo-image-picker'
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import ScreenWrapper from "@components/common/ScreenWrapper"
import BottomBarWrapper from "@components/common/BottomBarWrapper"
import { programThumbnails } from "@modules/AssetPaths"

type Props = NativeStackScreenProps<RootStackParamList, 'EditProgram'>

const NewProgramScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)

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
          className="w-full h-48 rounded-xl"
          resizeMode="contain" 
          source={thumbnail ? {uri: thumbnail} : programThumbnails["program_thumbnail_placeholder"]} 
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
          onPress={() => navigation.navigate('EditProgram', {
            name: name === null || name === '' ? 'My Custom Program' : name,
            description: description,
            thumbnail: thumbnail,
          })}
        >
          <Text className="text-xs text-custom-blue mr-2 font-BaiJamjuree-Bold">Create Your Program</Text>
          <Icon name="swap-horizontal" color="#5AABD6" size={24} /> 
        </TouchableOpacity>
      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default NewProgramScreen

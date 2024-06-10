import { Text, View, Image, TouchableOpacity, Pressable } from "react-native"
import { exerciseThumbnails } from "@modules/AssetPaths"
import { Icon } from "@react-native-material/core"
import { useNavigation } from "@react-navigation/native"

type Props = {
  id: number,
  selectedId: number | null | undefined,
  setSelectedId: (id: number) => void | undefined,
  name: string,
  thumbnail: keyof typeof exerciseThumbnails,
  difficulty: number
}

const ExerciseCard: React.FC<Props> = ({ id, selectedId, setSelectedId, name, thumbnail, difficulty }) => {
  const navigation = useNavigation()

  const viewDetails = (id: number) => {
    navigation.navigate('ExerciseDetails', { exerciseId: id }) 
  }

  const renderDifficulty = () => {
    let difProps = {
      text: '',
      color: '#121212',
    }

    switch (difficulty) {
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
      <View className="flex flex-row">
        <Text 
          className="text-xs font-BaiJamjuree-Bold mr-2"
          style={{ color: difProps.color }}
        >
          {difProps.text}
        </Text>
        <View className="flex flex-row mt-1">
          {Array.from({length: 5}).map((_, index) => {
            if (index < difficulty) {
              return <Icon key={index} name="star" color={difProps.color} size={10} /> 
            } else {
              return <Icon key={index} name="star-outline" color="#505050" size={10} /> 
            }
          })}
        </View>
      </View>
    )
  }

  return (
    <Pressable className={`
      w-full h-16 mb-2 p-1 flex-row border-2 rounded-xl
      ${selectedId === id ? 'border-custom-blue' : ' border-custom-dark'}
      `}
      onPress={() => {
        if (selectedId === undefined || setSelectedId === undefined) {
          viewDetails(id)
        } else {
          setSelectedId(id)
        }
      }}
    >
      <Image
        className={`w-1/6 h-full rounded-lg ${selectedId === id || !selectedId ? '' : 'opacity-50'}`}
        resizeMode="contain" 
        source={exerciseThumbnails[thumbnail] || { uri: thumbnail }} 
      />
      <View className="w-2/3 pl-3 flex-col justify-center">
        <Text className={`${selectedId === id || !selectedId ? 'text-custom-white' : 'text-custom-grey'} font-BaiJamjuree-Regular text-lg`}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
        {renderDifficulty()}
      </View>
      <TouchableOpacity 
        className="w-1/6 flex justify-center items-center"
        onPress={() => viewDetails(id)}
      >
        <Icon name="information-outline" size={24} color={selectedId === id || !selectedId ? '#F5F6F3' : '#4D594A'} />
      </TouchableOpacity>
    </Pressable>
  )
}

export default ExerciseCard

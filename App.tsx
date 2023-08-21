import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import HubScreen from '@screens/HubScreen'
import HomeScreen from '@screens/HomeScreen'
import NewSessionScreen from '@screens/NewSessionScreen'
import NewInstanceScreen from '@screens/NewInstanceScreen'
import NewProgramScreen from '@screens/NewProgramScreen'
import ProgramsScreen from '@screens/ProgramsScreen'
import ErrorModal from '@screens/ErrorModal'
import ConfirmModal from '@screens/ConfirmModal'
import DB from '@modules/DB'
import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as Font from 'expo-font'
import { customFonts } from '@modules/AssetPaths'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ActiveSessionScreen from '@screens/ActiveSessionScreen'
import EditProgramScreen from '@screens/EditProgramScreen'

export type RootStackParamList = {
  Home: undefined,
  Programs: undefined,
  Hub: {
    programId: number,
  },
  Settings: undefined,
  NewSession: { 
    routineId: number,
    sessionExists: boolean,
    sessionId: number,
    sessionTime: string,
  },
  NewInstance: { 
    sessionId: number,
  },
  NewProgram: undefined,
  EditProgram: {
    name: string,
    description: string | null,
    thumbnail: string | null,
  },
  ActiveSession: {
    sessionId: number,
    instanceData: any[],
  },
  ErrorModal: {
    title: string,
    message: string,
  },
  ConfirmModal: {
    text: string,
    onConfirm: () => void,
  },
}

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const Stack = createNativeStackNavigator<RootStackParamList>()

  useEffect(() => {
    const initializeDatabase = async () => {
      return await DB.initDatabase() 
    }

    const loadFonts = async () => {
      return await Font.loadAsync(customFonts) 
    }

    const loadAllAppAssets = async () => {
      try {
        await Promise.all([
          initializeDatabase(),
          loadFonts(),
        ])

        console.log('App Initialized!')
        setIsInitialized(true)
      } catch (error) {
        console.log('Error Initializing: ' + error)
      }
    }

    loadAllAppAssets()
  }, [])

  return isInitialized ? (
    <GestureHandlerRootView className='flex-1'>
      <SafeAreaProvider>
        <NavigationContainer>
          <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <Stack.Navigator initialRouteName='Home'>
              <Stack.Group
                screenOptions={{
                  presentation: 'card',
                  statusBarHidden: false,
                  statusBarColor: '#121212',
                  cardStyle: {
                    backgroundColor: '#121212',
                  },
                  headerStyle: {
                    backgroundColor: 'transparent',
                  },
                  headerTitleStyle: {
                    color: '#F5F6F3',
                    fontFamily: 'BaiJamjuree-Bold',
                    fontSize: 18,
                  },
                  headerTintColor: '#F5F6F3',
                }}
              >
                <Stack.Screen
                  name='Home'
                  component={HomeScreen}
                />
                <Stack.Screen
                  name='Programs'
                  component={ProgramsScreen}
                  options={{title: 'Programs'}}
                />
                <Stack.Screen
                  name='Hub'
                  component={HubScreen}
                  options={{title: 'Hub'}}
                />
                <Stack.Screen
                  name='NewSession'
                  component={NewSessionScreen}
                  options={{title: 'Edit Session'}}
                />
                <Stack.Screen
                  name='NewInstance'
                  component={NewInstanceScreen}
                  options={{title: 'Add New Session Exercise'}}
                />
                <Stack.Screen
                  name='NewProgram'
                  component={NewProgramScreen}
                  options={{title: 'Create New Program'}}
                />
                <Stack.Screen
                  name='EditProgram'
                  component={EditProgramScreen}
                  options={data => ({title: data.route.params.name})}
                />
              </Stack.Group>
              <Stack.Group 
                screenOptions={{ 
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name='ErrorModal'
                  component={ErrorModal}
                />
                <Stack.Screen
                  name='ConfirmModal'
                  component={ConfirmModal}
                />
              </Stack.Group>
              <Stack.Group 
                screenOptions={{
                  headerShown: false
                }}
              >
                <Stack.Screen
                  name='ActiveSession'
                  component={ActiveSessionScreen}
                />
              </Stack.Group>
            </Stack.Navigator>
          </IconComponentProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  ) : (
    <Text>Loading...</Text>
  )
}

export default App

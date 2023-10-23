import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import HubScreen from '@screens/HubScreen'
import HomeScreen from '@screens/HomeScreen'
import EditSessionScreen from '@screens/EditSessionScreen'
import ActiveSessionScreen from '@screens/ActiveSessionScreen'
import NewInstanceScreen from '@screens/NewInstanceScreen'
import ProgramsListScreen from '@screens/ProgramsListScreen'
import ExercisesListScreen from '@screens/ExercisesListScreen'
import EditProgramScreen from '@screens/EditProgramScreen'
import EditPhaseScreen from '@screens/EditPhaseScreen'
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
import DismissModal from '@screens/DismissModal'
import GetReadyScreen from '@screens/GetReadyScreen'
import SelectDayModal from '@screens/SelectDayModal'
import SetPhaseNameModal from '@screens/SetPhaseNameModal'
import SetProgramNameModal from '@screens/SetProgramNameModal'
import ChangeProgramStatusModal from '@screens/ChangeProgramStatusModal'

export type RootStackParamList = {
  Home: undefined,
  ProgramsList: undefined,
  ExercisesList: undefined,
  Hub: {
    screenWidth: number,
    dayNow: number,
  },
  Settings: undefined,
  EditSession: { 
    dayId: number,
    sessionId: number,
    sessionName: string,
    newSession: boolean,
    phaseId: number,
  },
  NewInstance: { 
    sessionId: number,
  },
  EditProgram: {
    programId: number,
  },
  EditPhase: {
    phaseId: number,
    phaseName: string,
    phaseStatus: string,
  },
  GetReady: {
    sessionId: number,
  },
  ActiveSession: {
    sessionId: number,
  },
  ErrorModal: {
    title: string,
    message: string,
  },
  ConfirmModal: {
    text: string,
    onConfirm: () => void,
  },
  DismissModal: {
    onConfirm: () => void,
  },
  SelectDayModal: {
    phaseId: number,
  },
  SetPhaseNameModal: {
    programId: number,
  },
  SetProgramNameModal: undefined,
  ChangeProgramStatusModal: {
    status: string,
    programId: number,
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

    const logAllData = async () => {
      return await DB.logAllDataAsJson()
    }

    const setResetDate = async () => {
      return await DB.setResetDate()
    }

    const loadAllAppAssets = async () => {
      try {
        await Promise.all([
          initializeDatabase(),
          loadFonts(),
        ])

        //await logAllData()

        await setResetDate()

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
            <Stack.Navigator
              initialRouteName='Home'
            >
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
                    fontSize: 16,
                  },
                  headerTintColor: '#F5F6F3'
                }}
              >
                <Stack.Screen
                  name='Home'
                  component={HomeScreen}
                  options={{title: 'EXRT'}}
                />
                <Stack.Screen
                  name='ProgramsList'
                  component={ProgramsListScreen}
                  options={{title: 'Programs'}}
                />
                <Stack.Screen
                  name='ExercisesList'
                  component={ExercisesListScreen}
                  options={{title: 'Exercises'}}
                />
                <Stack.Screen
                  name='Hub'
                  component={HubScreen}
                  options={{title: 'Hub'}}
                />
                <Stack.Screen
                  name='NewInstance'
                  component={NewInstanceScreen}
                  options={{title: 'Add New Session Exercise'}}
                />
                <Stack.Screen
                  name='EditSession'
                  component={EditSessionScreen}
                  options={{title: 'Edit Session' }}
                />
                <Stack.Screen
                  name='EditProgram'
                  component={EditProgramScreen}
                  options={{title: 'Edit Program'}}
                />
                <Stack.Screen
                  name='EditPhase'
                  component={EditPhaseScreen}
                  options={{ title: 'Edit Phase' }}
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
                <Stack.Screen
                  name='DismissModal'
                  component={DismissModal}
                />
                <Stack.Screen
                  name='SelectDayModal'
                  component={SelectDayModal}
                />
                <Stack.Screen
                  name='SetPhaseNameModal'
                  component={SetPhaseNameModal}
                />
                <Stack.Screen
                  name='SetProgramNameModal'
                  component={SetProgramNameModal}
                />
                <Stack.Screen
                  name='ChangeProgramStatusModal'
                  component={ChangeProgramStatusModal}
                />
              </Stack.Group>
              <Stack.Group 
                screenOptions={{
                  headerShown: false
                }}
              >
                <Stack.Screen
                  name='GetReady'
                  component={GetReadyScreen}
                />
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

import React, { useEffect, useState } from 'react'
import DB from '@modules/DB'
import { initNotificationsPermissionsCheck } from '@modules/Notifications'
import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as Font from 'expo-font'
import { preventAutoHideAsync } from 'expo-splash-screen'
import { customFonts } from '@modules/AssetPaths'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { CopilotProvider } from "react-native-copilot"
import HubScreen from '@screens/HubScreen'
import HomeScreen from '@screens/HomeScreen'
import SettingsScreen from '@screens/SettingsScreen'
import EditSessionScreen from '@screens/EditSessionScreen'
import ActiveSessionScreen from '@screens/ActiveSessionScreen'
import NewInstanceScreen from '@screens/NewInstanceScreen'
import ProgramsListScreen from '@screens/ProgramsListScreen'
import ExercisesListScreen from '@screens/ExercisesListScreen'
import ExerciseDetailsScreen from '@screens/ExerciseDetailsScreen'
import EditProgramScreen from '@screens/EditProgramScreen'
import EditPhaseScreen from '@screens/EditPhaseScreen'
import ErrorModal from '@screens/ErrorModal'
import ConfirmModal from '@screens/ConfirmModal'
import DismissModal from '@screens/DismissModal'
import GetReadyScreen from '@screens/GetReadyScreen'
import SelectDayModal from '@screens/SelectDayModal'
import SetPhaseNameModal from '@screens/SetPhaseNameModal'
import SetProgramNameModal from '@screens/SetProgramNameModal'
import ChangeProgramStatusModal from '@screens/ChangeProgramStatusModal'
import SessionResultsModal from '@screens/SessionResultsModal'
import FullScreenVideoScreen from '@screens/FullScreenVideo'
import EndSessionScreen from '@screens/EndSessionScreen'
import WelcomeScreen from '@screens/WelcomeScreen'
import CopilotCustomTooltip from '@components/common/CopilotCustomTooltip'

export type RootStackParamList = {
  Welcome: undefined,
  Home: {
    isFirstTime: boolean,
    copilotStep: string,
  } | undefined,
  ProgramsList: {
    isFirstTime: boolean,
  } | undefined,
  ExercisesList: undefined,
  ExerciseDetails: {
    exerciseId: number,
  },
  Hub: {
    isFirstTime: boolean,
  } | undefined,
  Settings: undefined,
  EditSession: {
    dayId: number,
    sessionId: number,
    sessionName: string,
    sessionCustom: number,
    newSession: boolean,
    phaseId: number,
  },
  NewInstance: {
    sessionId: number,
  },
  EditProgram: {
    programId: number,
    newProgram: boolean,
  },
  EditPhase: {
    phaseId: number,
    programId: number,
    phaseName: string,
    phaseCustom: number,
    phaseOrder: number,
    phaseStatus: string,
    newPhase: boolean,
  },
  GetReady: {
    sessionId: number,
    sessionName: string,
    phaseId: number,
    programId: number,
  },
  ActiveSession: {
    sessionId: number,
    sessionName: string,
    phaseId: number,
    programId: number,
  },
  EndSession: {
    sessionId: number,
    sessionName: string,
    timeTotal: number,
    exerciseIds: any[],
    phaseId: number,
    programId: number,
  },
  SessionResultsModal: {
    sessionId: number,
  },
  ErrorModal: {
    title: string,
    message: string,
  },
  ConfirmModal: {
    text: string,
    eventId: string,
  },
  DismissModal: {
    eventId: string,
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
  FullScreenVideo: {
    videoSource: string,
  },
}

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [initScreen, setInitScreen] = useState<keyof RootStackParamList | undefined>('Home')

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

    const setInitialScreen = async () => {
      const isFirstTimeLaunch = await DB.checkMetaFirstTime()

      if (isFirstTimeLaunch) {
        setInitScreen('Welcome' as keyof RootStackParamList)
      }
    }

    const loadAllAppAssets = async () => {
      try {
        await Promise.all([
          initializeDatabase(),
          loadFonts(),
        ])

        await initNotificationsPermissionsCheck()

        // await logAllData()

        await setResetDate()

        await setInitialScreen()
      } catch (error) {
        console.log('Error Initializing: ' + error)
      } finally {
        setIsInitialized(true)
      }
    }

    preventAutoHideAsync()
    loadAllAppAssets()
  }, [])

  return isInitialized ? (
    <GestureHandlerRootView className='flex-1'>
      <SafeAreaProvider>
        <NavigationContainer>
          <CopilotProvider
            overlay='svg'
            backdropColor='rgba(0,0,0,0.7)'
            verticalOffset={36}
            tooltipStyle={{
              borderRadius: 16,
              backgroundColor: '#F5F6F3',
              left: 16,
            }}
            tooltipComponent={(props: any) => <CopilotCustomTooltip {...props} />}
            stepNumberComponent={() => <></>}
          >
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Stack.Navigator initialRouteName={initScreen}>
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
                    headerShadowVisible: false,
                    headerTitleStyle: {
                      color: '#F5F6F3',
                      fontFamily: 'BaiJamjuree-Bold',
                      fontSize: 16,
                    },
                    headerTintColor: '#F5F6F3'
                  }}
                >
                  <Stack.Screen
                    name='Welcome'
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name='ProgramsList'
                    component={ProgramsListScreen}
                    options={{ title: 'Browse Programs' }}
                  />
                  <Stack.Screen
                    name='ExercisesList'
                    component={ExercisesListScreen}
                    options={{ title: 'Browse Exercises' }}
                  />
                  <Stack.Screen
                    name='ExerciseDetails'
                    component={ExerciseDetailsScreen}
                    options={{ title: 'Exercise Details' }}
                  />
                  <Stack.Screen
                    name='Hub'
                    component={HubScreen}
                    options={{ title: 'Hub' }}
                  />
                  <Stack.Screen
                    name='NewInstance'
                    component={NewInstanceScreen}
                    options={{ title: 'Add exercise' }}
                  />
                  <Stack.Screen
                    name='EditSession'
                    component={EditSessionScreen}
                    options={{ title: 'Session Details' }}
                  />
                  <Stack.Screen
                    name='EditProgram'
                    component={EditProgramScreen}
                    options={{ title: 'Program Details' }}
                  />
                  <Stack.Screen
                    name='EditPhase'
                    component={EditPhaseScreen}
                    options={{ title: 'Phase Details' }}
                  />
                  <Stack.Screen
                    name='Settings'
                    component={SettingsScreen}
                    options={{ title: 'Settings' }}
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
                  <Stack.Screen
                    name='SessionResultsModal'
                    component={SessionResultsModal}
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
                  <Stack.Screen
                    name='EndSession'
                    component={EndSessionScreen}
                  />
                  <Stack.Screen
                    name='FullScreenVideo'
                    component={FullScreenVideoScreen}
                    options={{
                      animation: 'fade',
                    }}
                  />
                </Stack.Group>
              </Stack.Navigator>
            </IconComponentProvider>
          </CopilotProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  ) : null
}

export default App

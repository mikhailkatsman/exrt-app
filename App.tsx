import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import Hub from './screens/Hub'
import db from './modules/DB'
import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const Stack = createNativeStackNavigator()


  useEffect(() => {
    db.initDatabase().then(() => setIsInitialized(true))
  }, [])

  return isInitialized ? (
    <NavigationContainer>
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
          />
          <Stack.Screen
            name='Hub'
            component={Hub}
            options={{title: 'Hub'}}
          />
          <Stack.Screen
            name='Settings'
            component={Settings}
          />
          <Stack.Screen
            name='NewSession'
            component={NewSession}
          />
          <Stack.Screen
            name='NewProgram'
            component={NewProgram}
          />
        </Stack.Navigator>
      </IconComponentProvider>
    </NavigationContainer>
  ) : (
    <Text>Loading...</Text>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import Hub from './screens/Hub'
import db from './modules/DB'
import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    db.initDatabase().then(() => setIsInitialized(true))
  }, [])

  return isInitialized ? (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <Hub />
    </IconComponentProvider>
  ) : (
    <Text>Loading...</Text>
  )
}

export default App

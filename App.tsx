import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import Hub from './screens/Hub'
import db from './modules/DB'

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    db.initDatabase().then(() => setIsInitialized(true))
    
  }, [])

  return isInitialized ? <Hub /> : <Text>Loading...</Text>
}

export default App

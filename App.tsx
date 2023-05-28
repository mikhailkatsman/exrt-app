import React, { useState } from 'react';
import Hub from './screens/Hub';
import { useEffect } from 'react';
import DB from './modules/DB'

const App: React.FC = () => {
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    var connection = DB.getConnection()
  }, [])

  return (
    <Hub />
  )
}

export default App

import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'

class DB {
  private db: SQLite.WebSQLDatabase | null
  private initialized: boolean

  constructor() {
    this.db = null
    this.initialized = false
  }

  async initDatabase(): Promise<void> {
    if (this.initialized) return

    const internalDbName: string = 'exrtdata.db'
    const sqlDir: string = FileSystem.documentDirectory + 'SQLite/'
    const dbPath: string = sqlDir + internalDbName
    
    //const temp = SQLite.openDatabase(internalDbName)
    //temp.closeAsync()
    //temp.deleteAsync()

    try {
      const { exists } = await FileSystem.getInfoAsync(dbPath)
      if (!exists) {
        await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true })
        const asset = Asset.fromModule(require('../assets/exrtdata.db'))
        await FileSystem.downloadAsync(asset.uri, dbPath)
      }

      this.db = SQLite.openDatabase(internalDbName)
      this.initialized = true
    } catch (error) {1
      console.error('Error initializing database:', error)
    }
  }

  public sql(
    query: string, 
    params?: (null | string | number)[], 
    successCallback?: SQLite.SQLStatementCallback, 
    errorCallback?: SQLite.SQLStatementErrorCallback,
  ): void {
    if (!this.initialized) {
      console.error('Database not initialized')
      return
    }

    if (this.db) {
      this.db.transaction(tx => {
        tx.executeSql(
          query, 
          params || [], 
          successCallback || undefined, 
          errorCallback || undefined, 
        )
      })
    }
  }
}

export default new DB()

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
    if (!this.initialized || !this.db) {
      console.error('Database not initialized')
      return
    }

    this.db.transaction(tx => {
      tx.executeSql(
        query, 
        params || [], 
        successCallback || undefined, 
        errorCallback || undefined, 
      )
    })
  }

  public transaction(
    transactionCallback: (tx: SQLite.SQLTransaction) => void,
    errorCallback?: SQLite.SQLTransactionErrorCallback,
    successCallback?: () => void,
  ): void {
    if (!this.initialized || !this.db) {
      console.error('Database not initialized')
      return
    }

    this.db.transaction(transactionCallback, errorCallback, successCallback)
  }

  public async logAllDataAsJson(): Promise<void> {
    if (!this.initialized || !this.db) {
      console.error('Database not initialized')
      return
    }

    const tableNames = [
      //'exercises',
      //'muscle_groups',
      //'exercise_muscle_groups',
      'exercise_instances',
      'sessions',
      'session_exercise_instances',
      'phases',
      'phase_session_instances',
      'programs',
      'program_phases'
    ]

    const allData: { [key: string]: any[] } = {}

    for (const tableName of tableNames) {
      await new Promise<void>((resolve, reject) => {
        this.db!.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM ${tableName}`, 
            [], 
            (_, resultSet) => {
              allData[tableName] = []
              for (let i = 0; i < resultSet.rows.length; i++) {
                allData[tableName].push(resultSet.rows.item(i))
              }
              resolve()
            }, 
            (_, error) => {
              console.error(`Error fetching data from ${tableName}:`, error)
              reject(error)
              return true
            }
          )
        })
      })
    }

    console.log(JSON.stringify(allData, null, 2))
  }
}

export default new DB()

import * as SQLite from 'expo-sqlite/legacy'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import axios from 'axios'
import { API_DATA_URL } from 'config'

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

    const debugClearData = async () => {
      const temp = SQLite.openDatabase(internalDbName)
      temp.closeAsync()
      temp.deleteAsync()
      const dirPath = FileSystem.documentDirectory + 'images/programs/'
      const folder = await FileSystem.readDirectoryAsync(dirPath)
      for (const img of folder) {
        await FileSystem.deleteAsync(`${dirPath}${img}`, { idempotent: true })
      }
    }

    // await debugClearData()

    try {
      const { exists } = await FileSystem.getInfoAsync(dbPath)
      if (!exists) {
        await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true })
        const asset = Asset.fromModule(require('../assets/exrtdata.db'))
        await FileSystem.downloadAsync(asset.uri, dbPath)
      }

      this.db = SQLite.openDatabase(internalDbName)
      this.initialized = true

      await this.syncWithRemoteServer()
    } catch (error) {
      console.error('Error initializing database:', error)
    }
  }


  public async syncWithRemoteServer(): Promise<void> {
    if (!this.initialized || !this.db) {
      console.error('Database not initialized')
      return
    }

    try {
      const { exercisesVersion, programsVersion } = await this.fetchVersions()

      const response = await axios.post(API_DATA_URL, {
        exercisesVersion, programsVersion
      })
      
      await this.seedDatabase(response.data)
    } catch (error) {
      console.error('Error syncing with remote server: ', error)
    }
  }

  private async fetchVersions(): Promise<{ exercisesVersion: Number, programsVersion: Number }> {
    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `SELECT value FROM metadata WHERE key IN ('exercises_version', 'programs_version')`,
          [],
          (_, result) => resolve({ exercisesVersion: result.rows.item(0).value, programsVersion: result.rows.item(1).value }),
          (_, error) => {
            console.error(`Error fetching versions:`, error)
            reject(error)
            return true
          }
        )
      })
    })
  }

  private async seedDatabase(data: any): Promise<void> {
    if (data.exercises.length > 0) {
      const exerciseQuery = `
        INSERT INTO exercises (id, name, type, style, difficulty, description, execution, thumbnail, video, background)
        VALUES ${data.exercises.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
      `

      const exerciseParams = data.exercises.flatMap((exercise: any) => [
        exercise.id,
        exercise.name,
        exercise.type,
        exercise.style,
        exercise.difficulty,
        exercise.description,
        exercise.execution,
        exercise.thumbnail,
        exercise.video,
        exercise.background,
      ])

      // execute exercise seed query

      const muscleGroupQuery = `
        INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, load)
        VALUES ${data.exercises.flatMap((exercise: any) => exercise.muscle_groups.map(() => '(?, ?, ?)')).join(', ')}
      `
      const muscleGroupParams = data.exercises.flatMap((exercise: any) =>
        exercise.muscle_groups.flatMap((muscleGroup: any) => [exercise.id, muscleGroup.id, muscleGroup.load])
      )

      // execute muscle groups seed query
    }

    if (data.programs.length > 0) {

    }
    
    return console.log('SEEDING FINISHED')
  } 

  public async setResetDate(): Promise<void> {
    if (!this.initialized || !this.db) {
      console.error('Database not initialized')
      return
    }

    await new Promise<void>((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `SELECT value FROM metadata WHERE key = 'last_reset';`, [],
          (_, result) => {
            const lastResetISO: string | null = result.rows.item(0).value
            const dateNow: Date = new Date()
            const dayNow: number = dateNow.getDay()

            if (!lastResetISO) {
              console.log('CREATING NEW RESET DATE')

              const prevMonday = new Date(dateNow)

              if (dayNow === 0) {
                prevMonday.setDate(dateNow.getDate() - 6)
              } else if (dayNow > 1) {
                prevMonday.setDate(dateNow.getDate() - (dayNow - 1))
              } else if (dayNow === 1) {
                prevMonday.setDate(dateNow.getDate() - 7)
              }

              prevMonday.setHours(0, 0, 0, 0)
              const prevMondayISO: string = prevMonday.toISOString()

              tx.executeSql(`
                UPDATE metadata 
                SET value = ?
                WHERE key = 'last_reset';
              `, [prevMondayISO])
            } else {
              const lastResetDate = new Date(lastResetISO)
              const daysSinceReset = Math.floor((dateNow.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24))

              if (daysSinceReset >= 7) {
                const thisMonday = new Date(dateNow)

                if (dayNow === 0) {
                  thisMonday.setDate(dateNow.getDate() - 6)
                } else {
                  thisMonday.setDate(dateNow.getDate() - (dayNow - 1))
                }

                thisMonday.setHours(0, 0, 0, 0)
                const thisMondayISO: string = thisMonday.toISOString()

                console.log('UPDATING RESET DATE TO: ' + thisMondayISO)

                tx.executeSql(`
                  UPDATE metadata 
                  SET value = ?
                  WHERE key = 'last_reset';`,
                  [thisMondayISO])

                tx.executeSql(`
                  UPDATE sessions
                  SET status = 'upcoming'
                  WHERE id IN (
                    SELECT psi.session_id
                    FROM phase_session_instances psi
                    JOIN phases p ON psi.phase_id = p.id
                    WHERE p.status = 'active'
                  );`,
                  [])
              }
            }

            resolve()
          },
          (_, error) => {
            console.error(`Error fetching metadata:`, error)
            reject(error)
            return true
          }
        )
      })
    })
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
            `SELECT * FROM ${tableName}`, [],
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

  public async checkMetaFirstTime(): Promise<boolean> {
    let firstTime: boolean = false

    await new Promise<void>((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(`
          SELECT value
          FROM metadata
          WHERE key = ?;
          `, ['first_time'],
          (_, resultSet) => {
            if (resultSet.rows.item(0).value === 'true') {
              firstTime = true
            }
            resolve()
          },
          (_, error) => {
            console.error(`Error Checking Meta Data`, error)
            reject(error)
            return true
          }
        )
      })
    })

    return firstTime
  }
}

export default new DB()

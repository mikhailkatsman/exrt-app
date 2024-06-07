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
      const { userExercisesVersion, userProgramsVersion } = await this.fetchVersions()

      const response = await axios.post(API_DATA_URL, {
        userExercisesVersion, userProgramsVersion
      })
      
      await this.seedDatabase(response.data)
    } catch (error) {
      console.error('Error syncing with remote server: ', error)
    }
  }

  private async fetchVersions(): Promise<{ userExercisesVersion: Number, userProgramsVersion: Number }> {
    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `SELECT value FROM metadata WHERE key IN ('exercises_version', 'programs_version')`,
          [],
          (_, result) => resolve({
            userExercisesVersion: parseInt(result.rows.item(0).value), 
            userProgramsVersion: parseInt(result.rows.item(1).value)
          }),
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
    const exercises = data.exercises
    const programs = data.programs

    if (exercises.length > 0) {
      const exerciseQuery = `
        INSERT INTO exercises (id, name, type, style, difficulty, description, execution, thumbnail, video, background, custom)
        VALUES ${exercises.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)').join(', ')}
      `
      const exerciseParams = exercises.flatMap((exercise: any) => [
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
      await new Promise(resolve => this.sql(exerciseQuery, exerciseParams, (_, result) => resolve(result)))

      const muscleGroupQuery = `
        INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, load)
        VALUES ${exercises.flatMap((exercise: any) => exercise.muscle_groups.map(() => '(?, ?, ?)')).join(', ')}
      `
      const muscleGroupParams = exercises.flatMap((exercise: any) =>
        exercise.muscle_groups.flatMap((muscleGroup: any) => [exercise.id, muscleGroup.id, muscleGroup.load])
      )
      await new Promise(resolve => this.sql(muscleGroupQuery, muscleGroupParams, (_, result) => resolve(result)))

      const setExercisesVersionQuery = `UPDATE metadata SET value = ? WHERE key = 'exercises_version'`
      await new Promise(resolve => this.sql(setExercisesVersionQuery, [data.versions.exercises_version], (_, result) => resolve(result)))

      console.log('EXERCISES SEEDING COMPLETE')
    }

    if (programs.length > 0) {
      const programQuery = `
        INSERT INTO programs (id, name, description, thumbnail, difficulty, type, status, custom)
        VALUES ${programs.map(() => "(?, ?, ?, ?, ?, ?, 'inactive', 0)").join(', ')}
      `
      const programParams = programs.flatMap((program: any) => [
        program.id,
        program.name,
        program.description,
        program.thumbnail,
        program.difficulty,
        program.type,
      ])
      await new Promise(resolve => this.sql(programQuery, programParams, (_, result) => resolve(result)))

      const phaseQuery = `
        INSERT INTO phases (id, name, description, status, custom)
        VALUES ${programs.flatMap((program: any) => program.phases.map(() => "(?, ?, ?, 'upcoming', 0)")).join(', ')}
      `
      const phaseParams = programs.flatMap((program: any) =>
        program.phases.flatMap((phase: any) => [phase.id, phase.name, phase.description])
      )
      await new Promise(resolve => this.sql(phaseQuery, phaseParams, (_, result) => resolve(result)))

      const programPhasesQuery = `
        INSERT INTO program_phases (program_id, phase_id, phase_order)
        VALUES ${programs.flatMap((program: any) => 
          program.phases.map((phase: any, index: number) => `(${program.id}, ${phase.id}, ${index + 1})`))
        .join(', ')}
      `
      await new Promise(resolve => this.sql(programPhasesQuery, [], (_, result) => resolve(result)))

      const sessions = programs
        .flatMap((program: any) => program.phases)
        .flatMap((phase: any) => phase.sessions)
        .map((session: any) => ({ id: session.id, name: session.name, exercises: session.exercises }))
      const sessionQuery = `
        INSERT INTO sessions (id, name, status, custom)
        VALUES ${sessions.map(() => "(?, ?, 'upcoming', 0)").join(', ')}
      `
      const sessionParams = sessions.flatMap((session: any) => [session.id, session.name])
      await new Promise(resolve => this.sql(sessionQuery, sessionParams, (_, result) => resolve(result)))

      const phaseSessionQuery = `
        INSERT INTO phase_session_instances (day_id, session_id, phase_id)
        VALUES ${programs.flatMap((program: any) => 
          program.phases.flatMap((phase: any) => 
            phase.sessions.map((session: any) => 
              `(${session.day_id}, ${session.id}, ${phase.id})`)))
        .join(', ')}
      `
      await new Promise(resolve => this.sql(phaseSessionQuery, [], (_, result) => resolve(result)))

      const exerciseInstances = sessions.flatMap((session: any) => session.exercises)
      const exerciseInstancesQuery = `
        INSERT INTO exercise_instances (id, exercise_id, sets, reps, minuteDuration, secondDuration, weight)
        VALUES ${exerciseInstances.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(', ')}
      `
      const exerciseInstancesParams = exerciseInstances.flatMap((instance: any) => [
        instance.id,
        instance.exercise_id,
        instance.sets,
        instance.reps,
        instance.minuteDuration,
        instance.secondDuration,
        instance.weight
      ])
      await new Promise(resolve => this.sql(exerciseInstancesQuery, exerciseInstancesParams, (_, result) => resolve(result)))
      
      const sessionExercisesQuery = `
        INSERT INTO session_exercise_instances (session_id, exercise_instance_id, instance_order)
        VALUES ${sessions.flatMap((session: any) => session.exercises.map(() => "(?, ?, ?)")).join(', ')}
      `
      const sessionExercisesParams = sessions.flatMap((session: any) =>
        session.exercises.flatMap((exercise: any, index: number) => 
          [session.id, exercise.id, index + 1]))
      await new Promise(resolve => this.sql(sessionExercisesQuery, sessionExercisesParams, (_, result) => resolve(result)))

      const setProgramsVersionQuery = `UPDATE metadata SET value = ? WHERE key = 'programs_version'`
      await new Promise(resolve => this.sql(setProgramsVersionQuery, [data.versions.programs_version], (_, result) => resolve(result)))
      
      console.log('PROGRAMS SEEDING COMPLETE')
    }

    return console.log('SEEDING CHECK COMPLETE')
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

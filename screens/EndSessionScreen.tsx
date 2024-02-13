import { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Icon } from "@react-native-material/core";
import { muscleGroups } from "@modules/AssetPaths"
import DB from "@modules/DB";
import ScreenWrapper from "@components/common/ScreenWrapper";
import BottomBarWrapper from "@components/common/BottomBarWrapper";

type Props = NativeStackScreenProps<RootStackParamList, 'EndSession'>

const EndSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const sessionId: number = route.params.sessionId
  const sessionName: string = route.params.sessionName
  const timeTotal: number = route.params.timeTotal
  const exerciseIds: any[] = route.params.exerciseIds
  const phaseId: number = route.params.phaseId
  const programId: number = route.params.programId

  const [activatedMuscleGroups, setActivatedMuscleGroups] = useState<{
    name: string,
    group: number,
    load: number 
  }[]>([])
  const [phaseCompleted, setPhaseCompleted] = useState<boolean>(false)
  const [programCompleted, setProgramCompleted] = useState<boolean>(false)

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = (totalSeconds % 60).toString()
    return `${hours > 0 ? hours.toString() + ' hr ' : ''}${minutes > 0 ? minutes.toString() + ' min ' : ''}${seconds} sec`
  }

  const fetchMuscleGroups = () => {
    const placeholders = exerciseIds.map(() => '?').join(', ');

    DB.sql(`
      SELECT emg.load AS muscleGroupLoad,
             mg.id AS muscleGroupId,
             mg.name AS muscleGroupName
      FROM exercise_muscle_groups emg
      LEFT JOIN muscle_groups mg
      ON emg.muscle_group_id = mg.id
      WHERE emg.exercise_id IN (${placeholders});
    `, exerciseIds,
    (_, result) => {
      const uniqueMuscleGroups: Record<string, { name: string, load: number, group: number }>= {}

      result.rows._array.forEach(item => {
        const name = item.muscleGroupName
        const load = item.muscleGroupLoad

        if (!uniqueMuscleGroups[name] || load > uniqueMuscleGroups[name].load) {
            uniqueMuscleGroups[name] = { name, load, group: item.muscleGroupId }
        }
      });

      const muscleGroups = Object.values(uniqueMuscleGroups)

      setActivatedMuscleGroups(muscleGroups)
    })
  }

  const changePhaseStatus = () => {
    DB.sql(`
      SELECT phase_order
      FROM program_phases
      WHERE phase_id = ?;
    `, [phaseId],
    (_, result) => {
      const phaseOrder = result.rows.item(0).phase_order

      DB.transaction(tx => {
        tx.executeSql(`
          UPDATE phases
          SET status = ?
          WHERE id = ?;
        `, ['completed', phaseId])

        tx.executeSql(`
          UPDATE phases
          SET status = ?
          WHERE id IN (
            SELECT phase_id
            FROM program_phases
            WHERE program_id = ?
            AND phase_order = ?
          );
        `, ['active', programId, phaseOrder + 1])
      },
        error => console.error('Error updating phase status: ' + error),
        () => navigation.pop()
      )
    })
  }

  const changeProgramStatus = () => {
    DB.transaction(tx => {
      tx.executeSql(`
        UPDATE sessions
        SET status = ?
        WHERE id IN (
          SELECT psi.session_id
          FROM phase_session_instances psi
          INNER JOIN program_phases pp ON pp.phase_id = psi.phase_id
          WHERE pp.program_id = ?
        );
      `, ['upcoming', programId])

      tx.executeSql(`
        UPDATE phases
        SET status = ?
        WHERE id = ?;
      `, ['completed', phaseId])

      tx.executeSql(`
        UPDATE programs
        SET status = ?
        WHERE id = ?;
      `, ['completed', programId])
    },
      error => console.error('Error updating phase status: ' + error),
      () => navigation.pop()
    )
  }

  const checkPhaseStatus = () => {
    DB.sql(`
      SELECT s.id
      FROM phase_session_instances psi
      JOIN sessions s
      ON psi.session_id = s.id
      WHERE psi.phase_id = ?
      AND s.status != 'completed';
    `, [phaseId],
    (_, result) => {
      if (result.rows.length === 0) checkProgramStatus()
    })
  }

  const checkProgramStatus = () => {
    DB.sql(`
      SELECT id
      FROM program_phases
      WHERE program_id = ?
      AND phase_order > (
        SELECT phase_order 
        FROM program_phases 
        WHERE phase_id = ?
      );
    `, [programId, phaseId],
    (_, result) => {
      if (result.rows.length === 0) {
        setProgramCompleted(true)
      } else {
        setPhaseCompleted(true)
      }
    })
  }

  const renderMessage = () => {
    let message: string = ''
    let suggestion: string = ''

    if (phaseCompleted) {
      message = "You have completed all the sessions in this phase!"
      suggestion = "Would you like to move on to the next phase of the program?"
    } else if (programCompleted) {
      message = "You have completed all the phases of this program!"
      suggestion = "Would you like mark this program as completed?"
    }
    
    return (
      <View className="h-fit mb-3 flex justify-center items-center gap-3">
        <Text className="w-3/4 font-BaiJamjuree-BoldItalic text-custom-white">
          {message}
        </Text>
        <Text className="w-3/4 font-BaiJamjuree-BoldItalic text-custom-white">
          {suggestion}
        </Text>
      </View>
    )
  }

  const renderBottomBarWrapper = () => {
    let leftButtonText: string = 'Continue'
    let rightButtonText: string = ''
    let rightButtonIcon: string = ''
    let rightButtonAction = undefined
    let renderrightButton: boolean = false

    if (phaseCompleted) {
      leftButtonText = 'Stay on this phase'
      rightButtonText = 'Advance to next phase'
      rightButtonIcon = 'chevron-triple-right'
      rightButtonAction = changePhaseStatus
      renderrightButton = true
    } else if (programCompleted) {
      leftButtonText = 'Stay on this phase'
      rightButtonText = 'Finish program'
      rightButtonIcon = 'flag-checkered'
      rightButtonAction = changeProgramStatus
      renderrightButton = true
    } 

    return (
      <BottomBarWrapper>
        <TouchableOpacity 
          className={`px-3 flex-1 rounded-xl border-2 border-custom-white flex-row ${renderrightButton ? 'justify-between' : 'justify-center'} items-center`}
          onPress={() => navigation.pop()}
          activeOpacity={0.6}
        >
          <Text className={`${renderrightButton ? 'w-[70%]' : 'mr-3'} text-custom-white font-BaiJamjuree-Bold capitalize`}>{leftButtonText}</Text>
          <Icon name="check" size={20} color="#F5F6F3" />
        </TouchableOpacity>
        {renderrightButton ? (
          <>
            <View className="w-3" />
            <TouchableOpacity 
              className="px-3 flex-1 rounded-xl border-2 border-custom-green flex-row justify-between items-center"
              onPress={rightButtonAction}
              activeOpacity={0.6}
            >
              <Text className="w-[70%] text-custom-green font-BaiJamjuree-Bold capitalize">{rightButtonText}</Text>
              <Icon name={rightButtonIcon} size={28} color="#74AC5D" />
            </TouchableOpacity>
          </>
        ) : undefined}
      </BottomBarWrapper>
    )
  }

  useEffect(() => {
    fetchMuscleGroups()
    checkPhaseStatus()
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex-1 flex-col items-center">
        <Text className="my-10 font-BaiJamjuree-Bold text-4xl text-custom-green">Completed!</Text>
        <Text className="font-BaiJamjuree-BoldItalic text-custom-grey">Session</Text>
        <Text className="mb-5 font-BaiJamjuree-Bold text-xl text-custom-white">{sessionName}</Text>
        <Text className="font-BaiJamjuree-BoldItalic text-custom-grey">Time</Text>
        <Text className="mb-5 font-BaiJamjuree-Bold text-lg text-custom-white">{formatTime(timeTotal)}</Text>
        <Text className="mb-5 font-BaiJamjuree-BoldItalic text-custom-grey">Activated Muscle Groups:</Text>
        <View className="h-64 w-full mb-8 relative">
          <Image className="absolute w-full h-full" resizeMode="contain" 
            source={muscleGroups['base' as keyof typeof muscleGroups]}
          />
          {activatedMuscleGroups.map((muscle, index) => {
            const fileName = `${muscle.group}-${muscle.load}` as keyof typeof muscleGroups
            return <Image key={index} className="absolute w-full h-full" resizeMode="contain" source={muscleGroups[fileName]} />
          })}
        </View>
      </View>
      {renderMessage()}
      {renderBottomBarWrapper()}
    </ScreenWrapper>
  )
}

export default EndSessionScreen

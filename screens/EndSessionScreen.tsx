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

  console.log(`
-------------------------
sessionId: ${sessionId}
phaseId: ${phaseId}
programId: ${programId}
  `)

  const [activatedMuscleGroups, setActivatedMuscleGroups] = useState<{
    name: string,
    group: number,
    load: number 
  }[]>([])

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

    `, [phaseId],
    (_, result) => {

    })
  }

  const changeProgramStatus = () => {
    DB.sql(`

    `, [programId],
    (_, result) => {

    })
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
        renderMessage('program')
        renderButton('program')
      }
    })
  }

  const renderMessage = (type: string) => {

  }

  const renderButton = (type: string) => {

  }

  useEffect(() => {
    fetchMuscleGroups()
    checkPhaseStatus()
  }, [])

  return (
    <ScreenWrapper>
      <View className="flex flex-col items-center">
        <Text className="my-16 font-BaiJamjuree-Bold text-4xl text-custom-white">Well Done!</Text>
        <Text className="font-BaiJamjuree-BoldItalic text-custom-white">Completed</Text>
        <Text className="mb-8 font-BaiJamjuree-Bold text-xl text-custom-white">{sessionName}</Text>
        <Text className="font-BaiJamjuree-BoldItalic text-custom-white">In</Text>
        <Text className="mb-8 font-BaiJamjuree-Bold text-lg text-custom-white">{formatTime(timeTotal)}</Text>
        <Text className="mb-3 font-BaiJamjuree-BoldItalic text-custom-white">Activated Muscle Groups:</Text>
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
      <BottomBarWrapper>

      </BottomBarWrapper>
    </ScreenWrapper>
  )
}

export default EndSessionScreen

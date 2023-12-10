import React, { Fragment, useEffect, useState } from "react"
import { TouchableOpacity, Text, View, ScrollView, ImageBackground } from "react-native"
import DB from '@modules/DB'
import TimeSlotInstanceCard from "@components/common/TimeSlotInstanceCard"
import { Icon } from "@react-native-material/core"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { programThumbnails } from "@modules/AssetPaths"

type Props = {
  routineId: number,
  session: {
    id: number,
    name: string,
    status: string,
    phase: string,
    program: string,
    thumbnail: string,
  },
  elementWidth: number,
}

const RoutineSlot: React.FC<Props> = ({
  session, 
  routineId, 
  elementWidth
}) => {
  const [instances, setInstances] = useState<any[]>([])

  let statusContext = { 
    statusText: 'Upcoming', 
    color: '#F5F6F3',
    buttonText: 'Start Session',
    icon: 'dumbbell',
  }

  if (session.status === 'completed') {
    statusContext = { 
      statusText: 'Completed', 
      color: '#74AC5D',
      buttonText: 'Repeat Session',
      icon: 'repeat-variant',
    }
  } else if (session.status === 'missed') {
    statusContext = { 
      statusText: 'Missed', 
      color: '#F4533E',
      buttonText: 'Retry Session',
      icon: 'repeat-variant',
    }
  }

  const navigation = useNavigation()

  useEffect(() => {
    DB.sql(`
      SELECT exercise_instances.id AS id, 
             exercise_instances.sets AS sets, 
             exercise_instances.reps AS reps, 
             exercise_instances.minuteDuration AS minuteDuration, 
             exercise_instances.secondDuration AS secondDuration, 
             exercise_instances.weight AS weight,
             exercises.name AS name,
             exercises.thumbnail AS thumbnail
      FROM session_exercise_instances
      JOIN exercise_instances
      ON session_exercise_instances.exercise_instance_id = exercise_instances.id
      JOIN exercises
      ON exercise_instances.exercise_id = exercises.id
      WHERE session_exercise_instances.session_id = ?
      ORDER BY instance_order ASC;
    `, [session.id],
    (_: any, result: any) => {
      const instanceData = result.rows._array.map((row: any) => ({
        id: row.id,
        name: row.name,
        thumbnail: row.thumbnail,
        sets: row.sets,
        reps: row.reps || null,
        minuteDuration: row.minuteDuration || null,
        secondDuration: row.secondDuration || null,
        weight: row.weight || null
      }))

      setInstances(instanceData)
    })
  }, [session])

  return (
    <View 
      className="h-full mx-2"
      style={{ width: elementWidth }}
    >
      <View 
        className="flex-1 flex-col overflow-hidden rounded-2xl border-x-2"
        style={{ borderColor: statusContext.color }}
      >
        <ImageBackground 
          className="absolute w-full h-2/3"
          resizeMode="cover"
          source={
            programThumbnails[session.thumbnail as keyof typeof programThumbnails] || 
            {uri: session.thumbnail}
          }
        />
        <LinearGradient
          className="absolute w-full h-full"
          colors={['rgba(18, 18, 18, 0.6)', '#121212', '#121212']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.45, 1]}
        />
        <View className="h-[8%] mt-3 mx-3 flex-row justify-between">
          <Text className="font-BaiJamjuree-BoldItalic text-sm" style={{color: statusContext.color}}>
            {statusContext.statusText}
          </Text>
          <TouchableOpacity 
            className="w-[25%] items-end justify-start mt-1"
            onPress={() => navigation.navigate("EditSession", { 
              routineId: routineId,
              sessionId: session.id, 
              newSession: false,
            })}
          >
            <Icon name="pencil" size={18} color="#F5F6F3" />
          </TouchableOpacity>
        </View>
        <View className="h-[15%] mx-3">
          <Text className="text-custom-white font-BaiJamjuree-Bold text-xl capitalize" style={{ lineHeight:22 }}>
            {session.name}
          </Text>
        </View>
        <View className="h-[10%] mx-3 mb-5">
          <Text className="text-custom-grey font-BaiJamjuree-RegularItalic text-xs">
            Phase:
          </Text>
          <Text className="text-custom-white font-BaiJamjuree-Bold capitalize">
            {session.phase}
          </Text>
        </View>
        <View className="h-[10%] mx-3 mb-5">
          <Text className="text-custom-grey font-BaiJamjuree-RegularItalic text-xs">
            Program:
          </Text>
          <Text className="text-custom-white font-BaiJamjuree-Bold capitalize">
            {session.program}
          </Text>
        </View>
        <View className="flex-1 mx-3 mb-3">
          <Text className="mb-2 text-custom-grey font-BaiJamjuree-RegularItalic text-xs">
            Exercises:
          </Text>
          <ScrollView 
            className="flex-1 mb-3"
            fadingEdgeLength={100}
          >
            {instances.map((instance, index) => (
              <Fragment key={`instance-${index}`}>
                <TimeSlotInstanceCard 
                  id={instance.id}
                  name={instance.name}
                  thumbnail={instance.thumbnail}
                  sets={instance.sets}
                  reps={instance.reps}
                  minuteDuration={instance.minuteDuration}
                  secondDuration={instance.secondDuration}
                  weight={instance.weight}
                />
                {index < instances.length - 1 && <View className="h-3" />}
              </Fragment>
            ))}
          </ScrollView>
          <TouchableOpacity 
            className="
              h-14 flex-row items-center border-2
              justify-center rounded-xl
            "
            style={{ borderColor: statusContext.color }}
            onPress={() => navigation.navigate("GetReady", { sessionId: session.id })}
          >
            <Text 
              className="mr-4 font-BaiJamjuree-Bold text"
              style={{ color: statusContext.color }}
            >
              {statusContext.buttonText}
            </Text>
            <Icon name={statusContext.icon} size={24} color={statusContext.color} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RoutineSlot

import ScreenWrapper from "@components/common/ScreenWrapper"
import ScrollPicker from "@components/common/ScrollPicker"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from 'App'
import DB from "@modules/DB"
import { useEffect, useState } from "react"
import { Text, View, Switch, TouchableOpacity } from "react-native"
import { Icon } from "@react-native-material/core"

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true)
  const [notificationsHour, setNotificationsHour] = useState<number | null>(null)
  const [notificationsMinute, setNotificationsMinute] = useState<number | null>(null)

  const hourValues = Array.from({ length: 24 }, (_, i) => i)
  const minuteValues = Array.from({ length: 60 }, (_, i) => i)

  useEffect(() => {
    DB.sql(`
      SELECT value 
      FROM metadata
      WHERE key IN (?, ?);
    `, ['notifications_enabled', 'notifications_time'],
    (_, result) => {
      setNotificationsEnabled(result.rows.item(0).value === 'true' ? true : false)
      setNotificationsHour(parseInt(result.rows.item(1).value.slice(0,2)))
      setNotificationsMinute(parseInt(result.rows.item(1).value.slice(2,4)))
    })
  }, [])

  const updateNotificationsStatus = () => {
    DB.sql(`
      UPDATE metadata 
      SET value = ?
      WHERE key = ?;
    `, [notificationsEnabled ? 'false': 'true', 'notifications_enabled'],
    () => setNotificationsEnabled(prev => !prev))
  }

  const updateNotificationsTime = (hourValue: number, minuteValue: number) => {
    const notificationsTime: string = hourValue.toString().padStart(2, '0') + minuteValue.toString().padStart(2, '0')

    DB.sql(`
      UPDATE metadata 
      SET value = ?
      WHERE key = ?;
    `, [notificationsTime, 'notifications_time'],
    () => {
      setNotificationsHour(hourValue)
      setNotificationsMinute(minuteValue)
    })
  }

  return (
    <ScreenWrapper>
      <View className="px-2 flex-1">
        <Text className="text-custom-white font-BaiJamjuree-BoldItalic mb-8">
          Notifications:
        </Text>
        <View className="flex flex-row justify-between items-start mb-8">
          <View className="w-2/3">
            <Text className="text-custom-white font-BaiJamjuree-Regular text-lg">
              Enable Notifications
            </Text>
            <Text className="text-custom-grey font-BaiJamjuree-Regular text-xs w-[90%]">
              Enable or disable session notifications for this device
            </Text>
          </View>
          <Switch
            className="-mt-2"
            trackColor={{ false: '#505050', true: '#505050' }}
            thumbColor={notificationsEnabled ? '#74AC5D' : '#F4533E'}
            onValueChange={updateNotificationsStatus}
            value={notificationsEnabled}
          />
        </View>
        <View className="flex flex-row justify-between items-start mb-8">
          <View className="w-2/3">
            <Text className="text-custom-white font-BaiJamjuree-Regular text-lg">
              Notification Time
            </Text>
            <Text className="text-custom-grey font-BaiJamjuree-Regular text-xs w-[90%]">
              Set time at which you want EXRT to send you notifications
            </Text>
          </View>
          {notificationsHour !== null && notificationsMinute !== null && (
            <View className="-mt-7 flex flex-row items-center justify-between">
              <ScrollPicker
                dataArray={hourValues.map(value => value.toString().padStart(2, '0'))}
                width={40}
                initialIndex={notificationsHour}
                onIndexChange={(index: number) => updateNotificationsTime(hourValues[index], notificationsMinute)}
              />
              <Text className="text-custom-white text-lg font-BaiJamjuree-Regular">:</Text>
              <ScrollPicker
                dataArray={minuteValues.map(value => value.toString().padStart(2, '0'))}
                width={40}
                initialIndex={notificationsMinute}
                onIndexChange={(index: number) => updateNotificationsTime(notificationsHour, minuteValues[index])}
              />
            </View>
          )}
        </View>
        <View className="border-b border-custom-grey my-3 mx-6" />
        <Text className="text-custom-white font-BaiJamjuree-BoldItalic mt-6 mb-8">
          Tutorials:
        </Text>
        <View className="flex flex-row justify-between items-start mb-8">
          <View className="flex-1">
            <Text className="text-custom-white font-BaiJamjuree-Regular text-lg">
              Basic Operations
            </Text>
            <Text className="text-custom-grey font-BaiJamjuree-Regular text-xs w-[90%]">
              How to subscribe to a program, navigate your hub and start an exercise session
            </Text>
          </View>
          <TouchableOpacity
            className="pl-3 pr-1 w-[100px] rounded-2xl border-2 border-custom-green flex-row justify-between items-center"
            onPress={() => {
              navigation.reset({
                routes: [
                  {
                    name: 'Home',
                    params: { isFirstTime: true }
                  },
                ],
              })
            }}
            activeOpacity={0.6}
          >
            <Text className="w-[70%] text-custom-green font-BaiJamjuree-Bold capitalize">
              Start
            </Text>
            <Icon name="chevron-right" size={28} color="#74AC5D" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-between items-start mb-8">
          <View className="flex-1">
            <Text className="text-custom-white font-BaiJamjuree-Regular text-lg">
              Custom Programs
            </Text>
            <Text className="text-custom-grey font-BaiJamjuree-Regular text-xs w-[90%]">
              How to create your own custom exercise program
            </Text>
          </View>
          <TouchableOpacity
            className="pl-3 pr-1 w-[100px] rounded-2xl border-2 border-custom-green flex-row justify-between items-center"
            onPress={() => {
              navigation.reset({
                routes: [
                  {
                    name: 'Home',
                    params: { isFirstTime: true }
                  },
                ],
              })
            }}
            activeOpacity={0.6}
          >
            <Text className="w-[70%] text-custom-green font-BaiJamjuree-Bold capitalize">
              Start
            </Text>
            <Icon name="chevron-right" size={28} color="#74AC5D" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default SettingsScreen

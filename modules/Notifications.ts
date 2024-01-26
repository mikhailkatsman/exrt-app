import * as Notifications from 'expo-notifications'

export const checkNotificationsPermissions = async() => {
  const status = await Notifications.getPermissionsAsync()
  if (!status.granted) return requestNotificationsPermissions()
  return status.granted
}

const requestNotificationsPermissions = async() => {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export const scheduleNotification = async(day: number, sessions: string[]) => {

}


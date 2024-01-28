import * as Notifications from 'expo-notifications'

export const checkNotificationsPermissions = async() => {
  const status = await Notifications.getPermissionsAsync()
  if (!status.granted) return requestNotificationsPermissions()
  return status.granted
}

export const requestNotificationsPermissions = async() => {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export const schedulePhaseNotifications = async(phaseId: number, dayId: number, dayName: string) => {
  const trigger = new Date()
  const currentDayOfWeek = trigger.getDay()
  trigger.setDate(trigger.getDate() + (dayId - (currentDayOfWeek === 0 ? 7 : currentDayOfWeek)))
  trigger.setHours(6)

  const sessions: {name: string, notification_id: string}[] = []

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${dayName} Sessions Reminder`,
      body: sessions.map(session => session.name).join(', ')
    },
    trigger: trigger
  })

}

export const updateNotification = async() => {
  const existingNotificationId = await Notifications.getAllScheduledNotificationsAsync()
  console.log(existingNotificationId)
}

export const cancelNotification = async() => {
}


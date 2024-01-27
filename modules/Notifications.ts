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

export const scheduleNotification = async(dayId: number, dayName: string) => {
  const trigger = new Date()
  trigger.setDate(trigger.getDate() + (dayId - trigger.getDay() + 7) % 7)
  trigger.setHours(0, 0, 0, 0)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Scheduled Sessions Reminder',
      body: `You have sessions to complete on ${dayName}`,
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


import * as Notifications from 'expo-notifications'
import DB from './DB'

export const initNotificationsPermissionsCheck = async() => {
  DB.sql(`
    SELECT value 
    FROM metadata
    WHERE key = ?;
  `, ['notifications_enabled'],
  (_, result) => {
    if (result.rows.item(0).value === 'true') {
      checkNotificationsPermissions()
    }
  })
}

const checkNotificationsPermissions = async() => {
  const status = await Notifications.getPermissionsAsync()
  if (!status.granted) return requestNotificationsPermissions()
  return status.granted
}

const requestNotificationsPermissions = async() => {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export const initNotificationsUpdate = () => {
  DB.sql(`
    SELECT value 
    FROM metadata
    WHERE key IN (?, ?);
  `, ['notifications_enabled', 'notifications_time'],
  (_, result) => {
    if (result.rows.item(0).value === 'true') {
      updateNotifications(result.rows.item(1).value)
    }
  })
}

const updateNotifications = async(timeString: string) => {
  await cancelNotifications()

  const hours = parseInt(timeString.substring(0, 2), 10);
  const minutes = parseInt(timeString.substring(2, 4), 10);

  const week: {id: number, name: string}[] = [
    {id: 1, name: 'Monday'},
    {id: 2, name: 'Tuesday'},
    {id: 3, name: 'Wednesday'},
    {id: 4, name: 'Thursday'},
    {id: 5, name: 'Friday'},
    {id: 6, name: 'Saturday'},
    {id: 7, name: 'Sunday'}
  ]

  const trigger = new Date()
  const currentDayOfWeek = trigger.getDay()
  const currentDate = trigger.getDate()
  trigger.setHours(hours, minutes)

  DB.sql(`
    SELECT psi.day_id, s.name
    FROM phase_session_instances psi
    JOIN sessions s ON psi.session_id = s.id
    JOIN phases p ON psi.phase_id = p.id
    WHERE p.status = 'active';
  `, [],
  (_, result) => {
    const sessions = result.rows._array
    const notificationsData: {title: string, body: string, trigger: Date}[] = []

    week.forEach(day => {
      if (sessions.some(session => session.day_id === day.id)) {
        const triggerDate = new Date(trigger);
        triggerDate.setDate(currentDate + (day.id - (currentDayOfWeek === 0 ? 7 : currentDayOfWeek)));

        const filteredSessions = sessions
          .filter(row => day.id === row.day_id)
          .map(session => session.name)
          .join(', ')

        notificationsData.push({
          title: 'EXRT',
          body: `${day.name} Sessions: ` + filteredSessions,
          trigger: triggerDate
        })
      }
    })
    
    scheduleAllNotifications(notificationsData)
  })
}

const scheduleAllNotifications = async(data: {title: string, body: string, trigger: Date}[]) => {
  for (const entry of data) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: entry.title,
        body: entry.body
      },
      trigger: entry.trigger
    });
  }
}

export const returnNotifications = async() => {
  const nots = await Notifications.getAllScheduledNotificationsAsync()
  console.log(JSON.stringify(nots, null, 4))
}

export const cancelNotifications = async() => {
  await Notifications.cancelAllScheduledNotificationsAsync()
}


import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

const registerForPushNotificationsAsync = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    })
  })

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return

  await scheduleGradeCheck()
  const token = (await Notifications.getExpoPushTokenAsync()).data
  console.log(token)
}

const scheduleGradeCheck = async () => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync()
  if (
    notifications.some(
      (notification) => notification.identifier === 'GradeCheck'
    )
  )
    return

  const strings: string[] = require('./assets/config.json').gradeCheck
  Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 Check Your Grades!',
      body: strings[Math.floor(Math.random() * strings.length)]
    },
    trigger: {
      repeats: true,
      hour: 7,
      minute: 0
    },
    identifier: 'GradeCheck'
  })
}

export default registerForPushNotificationsAsync

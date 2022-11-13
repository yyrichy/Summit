import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
}

const scheduleGradeCheck = async () => {
  try {
    const disabled = await AsyncStorage.getItem('GradeCheckReminderDisabled')
    if (disabled !== null) {
      if (JSON.parse(disabled)) return
    }

    await Notifications.cancelScheduledNotificationAsync('GradeCheck')

    var date = new Date()
    date.setHours(18, 0)
    const value = await AsyncStorage.getItem('GradeCheckReminderDate')
    if (value !== null) {
      date = new Date(JSON.parse(value))
    }
  } catch (e) {}
  console.log(date)

  const strings: string[] = require('./assets/config.json').gradeCheck
  Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 Check Your Grades!',
      body: strings[Math.floor(Math.random() * strings.length)]
    },
    trigger: {
      repeats: true,
      hour: date.getHours(),
      minute: date.getMinutes()
    },
    identifier: 'GradeCheck'
  })
}

export { registerForPushNotificationsAsync, scheduleGradeCheck }

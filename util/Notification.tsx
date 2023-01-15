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
    Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT
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
  if (await getReminderIsDisabled()) return
  const date = await getReminderDate()
  const strings: string[] = require('../assets/config.json').gradeCheckMessages
  try {
    await cancelReminder()
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Check Your Grades',
        body: strings[Math.floor(Math.random() * strings.length)]
      },
      trigger: {
        repeats: true,
        hour: date.getHours(),
        minute: date.getMinutes(),
        channelId: 'reminders'
      },
      identifier: 'GradeCheck'
    })
  } catch (e) {
    throw new Error()
  }
}

const getReminderIsDisabled = async () => {
  try {
    const disabled = await AsyncStorage.getItem('GradeCheckReminderDisabled')
    if (disabled !== null) {
      return JSON.parse(disabled)
    }
  } catch (e) {}
  return false
}

const setReminderIsDisabled = async (disabled: boolean) => {
  await AsyncStorage.setItem(
    'GradeCheckReminderDisabled',
    JSON.stringify(disabled)
  )
}

const getReminderDate = async () => {
  let date = new Date()
  date.setHours(18, 0)
  try {
    const value = await AsyncStorage.getItem('GradeCheckReminderDate')
    if (value !== null) {
      date = new Date(JSON.parse(value))
    }
  } catch (e) {}
  return date
}

const setReminderDate = async (date: Date) => {
  await AsyncStorage.setItem('GradeCheckReminderDate', JSON.stringify(date))
}

const cancelReminder = async () => {
  await Notifications.cancelScheduledNotificationAsync('GradeCheck')
}

export {
  registerForPushNotificationsAsync,
  scheduleGradeCheck,
  getReminderIsDisabled,
  getReminderDate,
  cancelReminder,
  setReminderIsDisabled,
  setReminderDate
}

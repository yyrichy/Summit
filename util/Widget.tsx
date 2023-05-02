import { requestWidgetUpdate } from 'react-native-android-widget'
import { AndroidWidget } from 'react-native-android-widget/src/AndroidWidget'
import BackgroundFetch from 'react-native-background-fetch'
import StudentVue from 'studentvue'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import * as SecureStore from 'expo-secure-store'
import { GradesWidget } from '../widgets/GradesWidget'
import React from 'react'

const updateGradesWidget = async (taskId: string) => {
  try {
    const widgetInfo = await AndroidWidget.getWidgetInfo('Grades')
    if (widgetInfo.length === 0) {
      BackgroundFetch.finish(taskId)
      return
    }
    try {
      const gradebook = await getGradebook()
      await requestWidgetUpdate({
        widgetName: 'Grades',
        renderWidget: () => <GradesWidget gradebook={gradebook} />
      })
    } catch (e) {
      await requestWidgetUpdate({
        widgetName: 'Grades',
        renderWidget: () => <GradesWidget error={e.message} />
      })
    }
  } catch (e) {}
  BackgroundFetch.finish(taskId)
}

const getGradebook = async () => {
  let username: string, password: string, district: SchoolDistrict, isParent: boolean
  try {
    username = await SecureStore.getItemAsync('username')
    password = await SecureStore.getItemAsync('password')
    district = JSON.parse(await SecureStore.getItemAsync('district'))
    const savedIsParent = await SecureStore.getItemAsync('isParent')
    isParent = savedIsParent === 'true'
  } catch (e) {
    throw new Error('Error retrieving saved login info')
  }
  if (!username || !password || !district) {
    throw new Error('No saved login info, open the app and login first')
  }
  try {
    const client = await StudentVue.login(district.parentVueUrl, {
      username: username,
      password: password,
      isParent: isParent
    })
    return await client.gradebook()
  } catch (e) {
    throw e
  }
}

export { updateGradesWidget, getGradebook }

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
    const gradebook = await getGradebook()
    if (!gradebook) {
      BackgroundFetch.finish(taskId)
      return
    }
    requestWidgetUpdate({
      widgetName: 'Grades',
      renderWidget: () => <GradesWidget gradebook={gradebook} />
    })
  } catch (e) {}
  BackgroundFetch.finish(taskId)
}

const getGradebook = async () => {
  try {
    const username: string = await SecureStore.getItemAsync('username')
    const password: string = await SecureStore.getItemAsync('password')
    const district: SchoolDistrict = JSON.parse(await SecureStore.getItemAsync('district'))
    const savedIsParent = await SecureStore.getItemAsync('isParent')
    const isParent: boolean = savedIsParent === 'true'
    if (!username || !password || !district || !savedIsParent) {
      return null
    }
    const client = await StudentVue.login(district.parentVueUrl, {
      username: username,
      password: password,
      isParent: isParent
    })
    return await client.gradebook()
  } catch (e) {
    return null
  }
}

export { updateGradesWidget, getGradebook }

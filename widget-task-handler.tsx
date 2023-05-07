import React from 'react'
import type { WidgetTaskHandlerProps } from 'react-native-android-widget'
import { GradesWidget } from './widgets/GradesWidget'
import { getGradebook, isWidgetDarkTheme } from './util/Widget'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'

const nameToWidget = {
  Grades: GradesWidget
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget]
  const dark = await isWidgetDarkTheme()

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      if (widgetInfo.widgetName === 'Grades') {
        props.renderWidget(<Widget dark={dark} />)
        try {
          const gradebook = await getGradebook()
          props.renderWidget(
            <Widget gradebook={gradebook} dark={Appearance.getColorScheme() === 'dark'} />
          )
        } catch (e) {
          props.renderWidget(<Widget error={e.message} dark={dark} />)
        }
      }
      break

    case 'WIDGET_RESIZED':
      // Not needed for now
      break

    case 'WIDGET_CLICK':
      if (props.clickAction === 'REFRESH') {
        props.renderWidget(<Widget dark={dark} />)
        try {
          const gradebook = await getGradebook()
          props.renderWidget(<Widget gradebook={gradebook} dark={dark} />)
        } catch (e) {
          props.renderWidget(<Widget error={e.message} dark={dark} />)
        }
      } else if (props.clickAction === 'TOGGLE_THEME') {
        const newIsDark: boolean = !props.clickActionData.dark
        props.renderWidget(<Widget dark={newIsDark} />)
        try {
          const gradebook = await getGradebook()
          props.renderWidget(<Widget gradebook={gradebook} dark={newIsDark} />)
          await AsyncStorage.setItem('WidgetThemeIsDark', `${newIsDark}`)
        } catch (e) {
          props.renderWidget(<Widget error={e.message} dark={newIsDark} />)
        }
      }
      break

    default:
      break
  }
}

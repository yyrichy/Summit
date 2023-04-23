import React from 'react'
import type { WidgetTaskHandlerProps } from 'react-native-android-widget'
import { GradesWidget } from './widgets/GradesWidget'
import { getGradebook } from './util/Widget'

const nameToWidget = {
  Grades: GradesWidget
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget]

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      if (widgetInfo.widgetName === 'Grades') {
        props.renderWidget(<Widget />)
        props.renderWidget(<Widget gradebook={await getGradebook()} />)
      }
      break

    case 'WIDGET_RESIZED':
      // Not needed for now
      break

    case 'WIDGET_CLICK':
      if (props.clickAction === 'REFRESH') {
        props.renderWidget(<Widget />)
        props.renderWidget(<Widget gradebook={await getGradebook()} />)
      }
      break

    default:
      break
  }
}

import { registerRootComponent } from 'expo'

import App from './App'
import { widgetTaskHandler } from './widget-task-handler'
import { registerWidgetTaskHandler } from 'react-native-android-widget'
import BackgroundFetch from 'react-native-background-fetch'
import { updateGradesWidget } from './util/Widget'
import { Platform } from 'react-native'

if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler)
  let MyHeadlessTask = async ({ taskId }) => {
    updateGradesWidget(taskId)
  }
  BackgroundFetch.registerHeadlessTask(MyHeadlessTask)
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)

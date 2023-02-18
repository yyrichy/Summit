import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ScheduleScreen from './ClassSchedule'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import CalendarScreen from './Calendar'

const Tab = createMaterialTopTabNavigator()

const Schedule = () => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.colors.surface
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: 'none'
          }
        }}
      >
        <Tab.Screen
          name="ScheduleTabs"
          component={ScheduleScreen}
          options={{
            tabBarLabel: 'Schedule'
          }}
        />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
      </Tab.Navigator>
    </View>
  )
}

export default Schedule

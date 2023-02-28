import * as React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Grades from '../screens/GradebookNavigator'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Documents from '../screens/Documents'
import Profile from '../screens/Profile'
import Schedule from '../screens/ScheduleNavigator'
import { useTheme } from 'react-native-paper'
import { DarkTheme } from '../theme/DarkTheme'

const Tab = createMaterialBottomTabNavigator()

const BottomNavigation = () => {
  const theme = useTheme()

  return (
    <Tab.Navigator
      initialRouteName="Grades"
      theme={DarkTheme}
      barStyle={{
        backgroundColor: theme.dark ? theme.colors.surface : theme.colors.elevation.level2
      }}
    >
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          tabBarLabel: 'Grades',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'chart-box' : 'chart-box-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        options={{
          tabBarLabel: 'Documents',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'folder' : 'folder-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavigation

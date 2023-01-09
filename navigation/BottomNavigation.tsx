import * as React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Grades from '../screens/Grades'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Documents from '../screens/Documents'
import Profile from '../screens/Profile'
import CalendarScreen from '../screens/Calendar'
import ScheduleScreen from '../screens/Schedule'

const Tab = createMaterialBottomTabNavigator()

const BottomNavigation = () => {
  return (
    <Tab.Navigator>
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
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-list' : 'view-list-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'calendar-blank' : 'calendar-blank-outline'}
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

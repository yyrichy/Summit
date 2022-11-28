import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Grades from '../screens/Grades'
import Profile from '../screens/Profile'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import Documents from '../screens/Documents'
import { Colors } from '../colors/Colors'
import CalendarScreen from '../screens/Calendar'

const Tab = createBottomTabNavigator()

const App = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          overflow: 'hidden'
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular'
        },
        tabBarItemStyle: {
          marginVertical: 4
        }
      }}
    >
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return (
              <MaterialIcons
                name={
                  tabInfo.focused ? 'insert-chart' : 'insert-chart-outlined'
                }
                size={tabInfo.size}
                color={Colors.navy}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        options={{
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name={tabInfo.focused ? 'folder' : 'folder-outline'}
                size={tabInfo.size}
                color={Colors.navy}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name={tabInfo.focused ? 'calendar' : 'calendar-outline'}
                size={tabInfo.size}
                color={Colors.navy}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="ProfileNav"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name={tabInfo.focused ? 'person' : 'person-outline'}
                size={tabInfo.size}
                color={Colors.navy}
              />
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default App

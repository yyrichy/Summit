import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Grades from '../screens/Grades'
import Profile from '../screens/Profile'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
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
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          overflow: 'hidden'
        }
      }}
    >
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return tabInfo.focused ? (
              <MaterialIcons
                name="insert-chart"
                size={30}
                color={Colors.navy}
              />
            ) : (
              <MaterialIcons
                name="insert-chart-outlined"
                size={30}
                color={Colors.secondary}
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
            return tabInfo.focused ? (
              <Ionicons name="folder" size={30} color={Colors.navy} />
            ) : (
              <Ionicons
                name="folder-outline"
                size={30}
                color={Colors.secondary}
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
            return tabInfo.focused ? (
              <Ionicons name="calendar" size={30} color={Colors.navy} />
            ) : (
              <Ionicons
                name="calendar-outline"
                size={30}
                color={Colors.secondary}
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
          tabBarIcon: (tabInfo) => {
            return tabInfo.focused ? (
              <Ionicons name="person" size={30} color={Colors.navy} />
            ) : (
              <Ionicons
                name="person-outline"
                size={30}
                color={Colors.secondary}
              />
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default App

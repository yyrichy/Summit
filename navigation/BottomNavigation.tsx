import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Grades from '../screens/Grades'
import Profile from '../screens/Profile'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LightTheme } from '../theme/LightTheme'
import Schedule from '../screens/Schedule'
import Documents from '../screens/Documents'
import { Platform, StyleSheet } from 'react-native'
import { Colors } from '../colors/Colors'

const colors = LightTheme.colors

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, 'Menu'>

const App = () => {
  const navigation = useNavigation<navScreenProp>()

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarStyle: {
          marginHorizontal: Platform.OS === 'android' ? 7 : 0,
          borderRadius: Platform.OS === 'android' ? 7 : 0,
          marginBottom: Platform.OS === 'android' ? 7 : 0
        }
      })}
    >
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          headerShown: false,
          tabBarLabelStyle: styles.header,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="trending-up-outline"
                size={tabInfo.focused ? 32 : 24}
                color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          headerShown: false,
          tabBarLabelStyle: styles.header,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="calendar-outline"
                size={tabInfo.focused ? 32 : 24}
                color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
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
          tabBarLabelStyle: styles.header,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="folder-outline"
                size={tabInfo.focused ? 32 : 24}
                color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabelStyle: styles.header,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="person-outline"
                size={tabInfo.focused ? 32 : 24}
                color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
              />
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Inter_700Bold'
  }
})

export default App

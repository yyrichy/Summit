import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Grades from '../screens/Grades'
import Profile from '../screens/Profile'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import Documents from '../screens/Documents'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { Colors } from '../colors/Colors'

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, 'Menu'>

const iconSize = (focused: boolean) => {
  return focused ? 30 : 28
}

const labelStyle = (focused: boolean) => {
  return {
    fontFamily: focused ? 'Montserrat_600SemiBold' : 'Montserrat_300Light',
    fontSize: focused ? 14 : 12
  }
}

const EmptyComponent = () => null

const App = () => {
  const navigation = useNavigation<navScreenProp>()

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false
      })}
    >
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          headerShown: false,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <View style={styles.icon_view_style}>
                <Ionicons
                  name="trending-up-outline"
                  size={iconSize(tabInfo.focused)}
                  color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
                />
                <Text style={labelStyle(tabInfo.focused)}>Grades</Text>
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        options={{
          headerShown: false,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <View style={styles.icon_view_style}>
                <Ionicons
                  name="folder-outline"
                  size={iconSize(tabInfo.focused)}
                  color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
                />
                <Text style={labelStyle(tabInfo.focused)}>Documents</Text>
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.onyx_gray,
          tabBarIcon: (tabInfo) => {
            return (
              <View style={styles.icon_view_style}>
                <Ionicons
                  name="person-outline"
                  size={iconSize(tabInfo.focused)}
                  color={tabInfo.focused ? Colors.onyx_gray : Colors.secondary}
                />
                <Text style={labelStyle(tabInfo.focused)}>Profile</Text>
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name="Logout"
        component={EmptyComponent}
        options={({ navigation }) => ({
          tabBarIcon: () => {
            return (
              <Ionicons
                name="exit-outline"
                size={32}
                color={Colors.middle_blue_green}
              />
            )
          },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.navigate('Login')}
            />
          )
        })}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  icon_view_style: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1
  },
  shadow: {
    shadowColor: Colors.onyx_gray,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})

export default App

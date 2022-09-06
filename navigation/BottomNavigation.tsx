import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Grades from '../screens/Grades'
import Profile from '../screens/Profile'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import Documents from '../screens/Documents'
import { TouchableOpacity } from 'react-native'
import { Colors } from '../colors/Colors'

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, 'Menu'>

const EmptyComponent = () => null

const App = () => {
  const navigation = useNavigation<navScreenProp>()

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
                color={Colors.middle_blue_green}
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
              <Ionicons
                name="folder"
                size={30}
                color={Colors.middle_blue_green}
              />
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
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: (tabInfo) => {
            return tabInfo.focused ? (
              <Ionicons
                name="person"
                size={30}
                color={Colors.middle_blue_green}
              />
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
      <Tab.Screen
        name="Logout"
        component={EmptyComponent}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: () => {
            return (
              <Ionicons name="exit-outline" size={32} color={Colors.black} />
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

export default App

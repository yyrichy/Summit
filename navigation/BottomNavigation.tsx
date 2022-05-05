import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Grades from '../screens/Grades'
import Profile from '../screens/Profile'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import Documents from '../screens/Documents'
import { TouchableOpacity } from 'react-native'
import { Colors } from '../colors/Colors'

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, 'Menu'>

const EmptyComponent = () => null

const color = (focused: boolean) => {
  return focused ? Colors.middle_blue_green : Colors.secondary
}

const App = () => {
  const navigation = useNavigation<navScreenProp>()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false
      }}
    >
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          headerShown: false,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.middle_blue_green,
          tabBarIcon: (tabInfo) => {
            return (
              <AntDesign name="book" size={30} color={color(tabInfo.focused)} />
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
          tabBarActiveTintColor: Colors.middle_blue_green,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="folder-outline"
                size={30}
                color={color(tabInfo.focused)}
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
          tabBarInactiveTintColor: Colors.secondary,
          tabBarActiveTintColor: Colors.middle_blue_green,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="person-outline"
                size={30}
                color={color(tabInfo.focused)}
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
          tabBarShowLabel: false,
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

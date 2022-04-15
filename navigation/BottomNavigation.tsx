import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Grades from "../screens/Grades"
import StudentInfo from "../screens/StudentInfo"
import React from "react"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../types/RootStackParams"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { LightTheme } from "../theme/LightTheme"

const colors = LightTheme.colors;

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, "Menu">

const App = () => {
  const navigation = useNavigation<navScreenProp>()

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Grades"
        component={Grades}
        options={{
          headerTitleAlign: "center",
          tabBarActiveTintColor: colors.primary,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="trending-up-outline"
                size={28}
                color={tabInfo.focused ? colors.primary : colors.gray}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="Student Info"
        component={StudentInfo}
        options={{
          headerTitleAlign: "center",
          tabBarActiveTintColor: colors.primary,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="person-outline"
                size={28}
                color={tabInfo.focused ? colors.primary : colors.gray}
              />
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default App

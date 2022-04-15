import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Grades from "../screens/Grades"
import StudentInfo from "../screens/StudentInfo"
import React from "react"
import { useState } from "react"
import AppContext from "../components/AppContext"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../types/RootStackParams"
import { useNavigation } from "@react-navigation/native"

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, "Menu">

const App = ({
  route: {
    params: {
      user: { username: u, password: p, client: c }
    }
  }
}) => {
  const navigation = useNavigation<navScreenProp>()
  const [username] = useState(u)
  const [password] = useState(p)
  const [client] = useState(c)
  const user = {
    username: username,
    password: password,
    client: client
  }

  return (
    <AppContext.Provider value={user}>
      <Tab.Navigator>
        <Tab.Screen
          name="Grades"
          component={Grades}
          options={{ headerTitleAlign: "center" }}
        />
        <Tab.Screen
          name="Student Info"
          component={StudentInfo}
          options={{ headerTitleAlign: "center" }}
        />
      </Tab.Navigator>
    </AppContext.Provider>
  )
}

export default App

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Grades from "../screens/Grades"
import StudentInfo from "../screens/StudentInfo"
import React from "react"
import { useState } from "react"
import AppContext from "../components/AppContext"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../screens/RootStackParams"
import { useNavigation } from "@react-navigation/native"

const Tab = createBottomTabNavigator()
type navScreenProp = StackNavigationProp<RootStackParamList, "Menu">

const App = ({ route }) => {
  const navigation = useNavigation<navScreenProp>()
  const [username, setUsername] = useState(route.params.user.username)
  const [password, setPassword] = useState(route.params.user.password)
  const [client, setClient] = useState(route.params.user.client)
  const user = {
    username: username,
    password: password,
    client: client,
    setUsername,
    setPassword,
    setClient
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

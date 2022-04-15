import Login from "./screens/Login"
import React from "react"
import BottomNavigation from "./navigation/BottomNavigation"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { RootStackParamList } from "./types/RootStackParams"
import { useState } from "react"
import AppContext from "./components/AppContext"
import { User } from "./types/User"
import { LightTheme } from "./theme/LightTheme"

const Stack = createStackNavigator<RootStackParamList>()

const App = () => {
  const [client, setClient] = useState(undefined)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const user: User = {
    username: username,
    password: password,
    client: client,
    setUsername,
    setPassword,
    setClient
  }

  return (
    <AppContext.Provider value={user}>
      <NavigationContainer theme={LightTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Menu"
            component={BottomNavigation}
            options={{ headerTitle: "" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App

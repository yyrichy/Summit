import Login from './screens/Login'
import React, { useState } from 'react'
import BottomNavigation from './navigation/BottomNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './types/RootStackParams'
import AppContext from './components/AppContext'
import { LightTheme } from './theme/LightTheme'

const Stack = createStackNavigator<RootStackParamList>()

const App = () => {
  const [client, setClient] = useState(undefined)
  const [gradebook, setGradebook] = useState(undefined)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = {
    username: username,
    password: password,
    client: client,
    gradebook: gradebook,
    setUsername,
    setPassword,
    setClient,
    setGradebook
  }

  return (
    <AppContext.Provider value={user}>
      <NavigationContainer theme={LightTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitleAlign: 'center',
              headerTitle: 'Welcome to ScholarHelper'
            }}
          />
          <Stack.Screen
            name="Menu"
            component={BottomNavigation}
            options={{ headerTitle: '' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App

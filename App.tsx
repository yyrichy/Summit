import Login from './screens/Login'
import React, { useState } from 'react'
import BottomNavigation from './navigation/BottomNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './types/RootStackParams'
import AppContext from './contexts/AppContext'
import { LightTheme } from './theme/LightTheme'
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black
} from '@expo-google-fonts/inter'
import { View } from 'react-native'

const Stack = createStackNavigator<RootStackParamList>()

const App = () => {
  const [client, setClient] = useState(undefined)
  const [marks, setMarks] = useState(undefined)
  const [gradebook, setGradebook] = useState(undefined)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = {
    username: username,
    password: password,
    client: client,
    marks: marks,
    gradebook: gradebook,
    setUsername,
    setPassword,
    setClient,
    setMarks,
    setGradebook
  }
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
  })
  if (!fontsLoaded) {
    return <View></View>
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
              headerTitle: 'Welcome to ScholarHelper',
              headerTitleStyle: {
                fontFamily: 'Inter_900Black'
              }
            }}
          />
          <Stack.Screen
            name="Menu"
            component={BottomNavigation}
            options={{
              headerTitle: '',
              headerBackTitle: 'Back to Login',
              headerBackTitleStyle: {
                fontFamily: 'Inter_400Regular'
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App

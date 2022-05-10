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
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic
} from '@expo-google-fonts/montserrat'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'

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
    Inter_900Black,
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic
  })
  if (!fontsLoaded) {
    return <View></View>
  }

  return (
    <>
      <SafeAreaProvider>
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
                  headerShown: false
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppContext.Provider>
      </SafeAreaProvider>
      <FlashMessage position="top" />
    </>
  )
}

export default App

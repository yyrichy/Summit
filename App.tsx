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
import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'
import { User } from './interfaces/User'
import { ActivityIndicator, Text, View } from 'react-native'
import { Colors } from './colors/Colors'

const Stack = createStackNavigator<RootStackParamList>()

const App = () => {
  const [client, setClient] = useState(undefined)
  const [marks, setMarks] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const user: User = {
    username: username,
    password: password,
    client: client,
    marks: marks,
    setUsername,
    setPassword,
    setClient,
    setMarks
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
    return (
      <>
        <View style={{ backgroundColor: Colors.primary }}>
          <Text style={{ margin: 10 }}>Loading Schools...</Text>
          <ActivityIndicator
            color={Colors.secondary}
            animating={true}
            size="large"
          />
        </View>
      </>
    )
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
                  headerShown: false
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

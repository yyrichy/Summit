import 'react-native-url-polyfill/auto'
import Login from './screens/Login'
import React, { useState } from 'react'
import BottomNavigation from './navigation/BottomNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
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
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'
import { User } from './interfaces/User'
import { ActivityIndicator, Platform, Text, View } from 'react-native'
import { Colors } from './colors/Colors'
import { Client } from 'studentvue'
import { Marks } from './interfaces/Gradebook'
import { CookiesProvider } from 'react-cookie'

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  const [client, setClient] = useState(undefined as Client)
  const [marks, setMarks] = useState(undefined as Marks)
  const [username, setUsername] = useState(undefined as string)
  const [password, setPassword] = useState(undefined as string)
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
    Montserrat_900Black_Italic,
    RussoOne_400Regular
  })

  if (!fontsLoaded) {
    return (
      <View
        style={{
          backgroundColor: Colors.primary,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{ marginBottom: 10 }}>Loading Schools...</Text>
        <ActivityIndicator
          color={Colors.secondary}
          animating={true}
          size="large"
        />
      </View>
    )
  }

  return (
    <CookiesProvider>
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
    </CookiesProvider>
  )
}

export default App

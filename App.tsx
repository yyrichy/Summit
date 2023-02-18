import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import Login from './screens/Login'
import React, { useCallback, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './types/RootStackParams'
import AppContext from './contexts/AppContext'
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
import { User } from './interfaces/User'
import { Client } from 'studentvue'
import { Marks } from './interfaces/Gradebook'
import { Provider as PaperProvider } from 'react-native-paper'
import BottomNavigation from './navigation/BottomNavigation'
import { CalendarProvider } from 'react-native-calendars'
import { NavLightTheme as LightTheme } from './theme/LightTheme'
import { MD3LightTheme } from './theme/MD3LightTheme'
import { RootSiblingParent } from 'react-native-root-siblings'
import * as SplashScreen from 'expo-splash-screen'
import mobileAds from 'react-native-google-mobile-ads'

mobileAds().initialize()

const Stack = createNativeStackNavigator<RootStackParamList>()

SplashScreen.preventAutoHideAsync()

const App = () => {
  const [client, setClient] = useState(null as Client)
  const [marks, setMarks] = useState(null as Marks)

  const user: User = {
    client: client,
    marks: marks,
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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // Hide the splash screen
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <RootSiblingParent>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <AppContext.Provider value={user}>
          <CalendarProvider date="">
            <PaperProvider theme={MD3LightTheme}>
              <NavigationContainer theme={LightTheme}>
                <Stack.Navigator initialRouteName="Login">
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
            </PaperProvider>
          </CalendarProvider>
        </AppContext.Provider>
      </SafeAreaProvider>
    </RootSiblingParent>
  )
}

export default App

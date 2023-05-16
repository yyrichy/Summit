import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import Login from './screens/Login'
import React, { useCallback, useMemo, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
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
import {
  RobotoSerif_100Thin,
  RobotoSerif_200ExtraLight,
  RobotoSerif_300Light,
  RobotoSerif_400Regular,
  RobotoSerif_500Medium,
  RobotoSerif_600SemiBold,
  RobotoSerif_700Bold,
  RobotoSerif_800ExtraBold,
  RobotoSerif_900Black,
  RobotoSerif_100Thin_Italic,
  RobotoSerif_200ExtraLight_Italic,
  RobotoSerif_300Light_Italic,
  RobotoSerif_400Regular_Italic,
  RobotoSerif_500Medium_Italic,
  RobotoSerif_600SemiBold_Italic,
  RobotoSerif_700Bold_Italic,
  RobotoSerif_800ExtraBold_Italic,
  RobotoSerif_900Black_Italic
} from '@expo-google-fonts/roboto-serif'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { User } from './interfaces/User'
import { Client } from 'studentvue'
import { Marks } from './interfaces/Gradebook'
import BottomNavigation from './navigation/BottomNavigation'
import { CalendarProvider } from 'react-native-calendars'
import { NavLightTheme as LightTheme } from './theme/LightTheme'
import { MD3LightTheme as CustomLightTheme } from './theme/MD3LightTheme'
import { RootSiblingParent } from 'react-native-root-siblings'
import * as SplashScreen from 'expo-splash-screen'
import mobileAds from 'react-native-google-mobile-ads'
import { MD3DarkTheme as CustomDarkTheme } from './theme/MD3DarkTheme'
import { DarkTheme } from './theme/DarkTheme'
import { Appearance } from 'react-native'
import * as Sentry from 'sentry-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useAsyncEffect from 'use-async-effect'
import { useMaterial3Theme } from '@pchmn/expo-material3-theme'
import { Provider as PaperProvider } from 'react-native-paper'
import { Colors } from './colors/Colors'

Sentry.init({
  release: 'com.vaporys.Summit@1.3.22',
  dsn: 'https://e3a198c431684c50b83c5dfa94e21436@o4504763946303488.ingest.sentry.io/4504763949580288'
})

mobileAds().initialize()

const Stack = createNativeStackNavigator()

SplashScreen.preventAutoHideAsync()

const App = () => {
  const [client, setClient] = useState(null as Client)
  const [marks, setMarks] = useState(null as Marks)
  const { theme, updateTheme } = useMaterial3Theme({ sourceColor: Colors.primary })
  const [isDarkTheme, setIsDarkTheme] = useState(null as boolean)
  const paperTheme = useMemo(
    () =>
      isDarkTheme
        ? { ...CustomDarkTheme, colors: theme.dark }
        : { ...CustomLightTheme, colors: theme.light },
    [isDarkTheme, theme]
  )

  useAsyncEffect(async () => {
    Appearance.addChangeListener(async ({ colorScheme }) => {
      const theme = await AsyncStorage.getItem('Theme')
      if (!theme || theme === 'device') setIsDarkTheme(colorScheme === 'dark' ? true : false)
    })
    let themeColor: string
    try {
      themeColor = await AsyncStorage.getItem('ThemeColor')
    } catch (e) {}
    if (!themeColor) themeColor = Colors.primary
    updateTheme(themeColor)
    let theme: any
    try {
      theme = await AsyncStorage.getItem('Theme')
    } catch (e) {}
    if (!theme || theme === 'device') theme = Appearance.getColorScheme()
    setIsDarkTheme(theme === 'dark' ? true : false)
  }, [])

  const user: User = {
    client,
    marks,
    isDarkTheme,
    setClient,
    setMarks,
    setIsDarkTheme,
    updateTheme
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
    RobotoSerif_100Thin,
    RobotoSerif_200ExtraLight,
    RobotoSerif_300Light,
    RobotoSerif_400Regular,
    RobotoSerif_500Medium,
    RobotoSerif_600SemiBold,
    RobotoSerif_700Bold,
    RobotoSerif_800ExtraBold,
    RobotoSerif_900Black,
    RobotoSerif_100Thin_Italic,
    RobotoSerif_200ExtraLight_Italic,
    RobotoSerif_300Light_Italic,
    RobotoSerif_400Regular_Italic,
    RobotoSerif_500Medium_Italic,
    RobotoSerif_600SemiBold_Italic,
    RobotoSerif_700Bold_Italic,
    RobotoSerif_800ExtraBold_Italic,
    RobotoSerif_900Black_Italic
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isDarkTheme !== null) {
      // Hide the splash screen
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isDarkTheme])

  if (!fontsLoaded || isDarkTheme === null) {
    return null
  }

  return (
    <RootSiblingParent>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <AppContext.Provider value={user}>
          <CalendarProvider date="">
            <PaperProvider theme={paperTheme}>
              <NavigationContainer theme={isDarkTheme ? DarkTheme : LightTheme}>
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

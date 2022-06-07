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
import FlashMessage, { showMessage } from 'react-native-flash-message'
import StudentVue from 'studentvue'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import { User } from './interfaces/User'
import { ActivityIndicator, Text } from 'react-native'
import useAsyncEffect from 'use-async-effect'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from './colors/Colors'
import AwesomeAlert from 'react-native-awesome-alerts'

const Stack = createStackNavigator<RootStackParamList>()

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false)

  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined as string)

  const [client, setClient] = useState(undefined)
  const [marks, setMarks] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [districts, setDistricts] = useState([] as SchoolDistrict[])
  const user: User = {
    username: username,
    password: password,
    client: client,
    marks: marks,
    districts: districts,
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

  function alert(message: string) {
    setErrorMessage(message)
    setShowAlert(true)
  }

  useAsyncEffect(async () => {
    const districts = [] as SchoolDistrict[]
    for (let i = 0; i <= 9; i++) {
      try {
        const res = await StudentVue.findDistricts(`${i}  `)
        for (const district of res) {
          if (!districts.some((d) => d.name === district.name))
            districts.push(district)
          if (i == 0) {
            console.log(district.name + district.address)
          }
        }
        districts.sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
      } catch (err) {
        alert(err.message)
        return
      }
    }
    setDistricts(districts)
    setAppIsReady(true)
  }, [])

  if (!fontsLoaded || !appIsReady) {
    return (
      <>
        <LinearGradient
          colors={['#FFF785', Colors.primary]}
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ margin: 10 }}>Loading Schools...</Text>
          <ActivityIndicator
            color={Colors.secondary}
            animating={true}
            size="large"
          />
        </LinearGradient>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={'Error'}
          message={errorMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText={'Ok'}
          confirmButtonColor={Colors.primary}
          confirmButtonTextStyle={{ color: Colors.black }}
          onConfirmPressed={() => {
            setShowAlert(false)
          }}
        ></AwesomeAlert>
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

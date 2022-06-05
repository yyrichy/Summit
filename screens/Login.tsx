import React, { useContext, useEffect, useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Linking,
  KeyboardAvoidingView
} from 'react-native'
import StudentVue from 'studentvue'
import * as SecureStore from 'expo-secure-store'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import AppContext from '../contexts/AppContext'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import GradeUtil from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import AwesomeAlert from 'react-native-awesome-alerts'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import DropDownPicker from 'react-native-dropdown-picker'

type loginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>

const Login = () => {
  const navigation = useNavigation<loginScreenProp>()
  const { username, password, setUsername, setPassword, setClient, setMarks } =
    useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined as string)

  const [open, setOpen] = useState(false)
  const [districts, setDistricts] = useState(undefined as SchoolDistrict[])
  const [value, setValue] = useState('')
  const [items, setItems] = useState([] as { label: string; value: string }[])

  if (
    Platform.OS !== 'web' &&
    username === undefined &&
    password === undefined &&
    value === ''
  ) {
    savedCredentials()
  }

  useEffect(() => {
    let isMounted = true
    const fetchDistricts = async () => {
      setIsLoading(true)
      try {
        const districts = [] as SchoolDistrict[]
        for (let i = 0; i <= 9; i++) {
          const res = await StudentVue.findDistricts(`${i}  `)
          for (const district of res) {
            if (!districts.some((d) => d.name === district.name))
              districts.push(district)
          }
          districts.sort((a, b) => {
            const nameA = a.name.toUpperCase()
            const nameB = b.name.toUpperCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          if (isMounted) {
            setDistricts(districts)
            setItems(
              districts.map((d) => {
                return { label: d.name, value: d.name }
              })
            )
          }
        }
      } catch {}
      setIsLoading(false)
    }
    fetchDistricts()
    return () => {
      isMounted = false
    }
  }, [items, districts])

  async function savedCredentials() {
    setUsername(await getValueFor('Username'))
    setPassword(await getValueFor('Password'))
    setValue((await getValueFor('District')) || '')
  }

  function alert(message: string) {
    setErrorMessage(message)
    setShowAlert(true)
  }

  async function onLogin() {
    setIsLoading(true)
    if (!username) {
      alert('Enter your username')
      setIsLoading(false)
      return
    }
    if (!password) {
      alert('Enter your password')
      setIsLoading(false)
      return
    }
    if (value === '') {
      alert('Select your school district')
      setIsLoading(false)
      return
    }
    try {
      const client = await StudentVue.login(
        districts.find((d) => d.name === value).parentVueUrl,
        {
          username: username,
          password: password
        }
      )
      const gradebook = await client.gradebook()
      const marks = await GradeUtil.convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
    } catch (err) {
      setIsLoading(false)
      alert(err.message)
      return
    }
    setUsername(username)
    setPassword(password)
    if (Platform.OS !== 'web' && isChecked) {
      save('Username', username)
      save('Password', password)
      save('District', value)
    }
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  async function openInstagram() {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const appUrl = 'instagram://user?username=richardyin99'
      try {
        if (await Linking.canOpenURL(appUrl)) {
          Linking.openURL(appUrl)
        } else {
          try {
            Linking.openURL('https://instagram.com/richardyin99')
          } catch (err) {
            alert('Cannot open Instagram')
          }
        }
      } catch (err) {
        alert('Cannot open Instagram')
      }
    } else {
      try {
        Linking.openURL('https://instagram.com/richardyin99')
      } catch (err) {
        alert('Cannot open Instagram')
      }
    }
  }

  return (
    <>
      <LinearGradient
        colors={['#FFF785', Colors.primary]}
        style={{
          flex: 1
        }}
      >
        <SafeAreaView style={{ alignItems: 'center' }}>
          <Text style={styles.welcome}>Welcome To{'\n'}Summit</Text>
        </SafeAreaView>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TextInput
            defaultValue={username}
            onChangeText={(u) => setUsername(u)}
            placeholder={'Username'}
            style={styles.input}
          />
          <TextInput
            defaultValue={password}
            onChangeText={(p) => setPassword(p)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          {items && (
            <DropDownPicker
              searchable={true}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              maxHeight={null}
              style={styles.dropdown}
              textStyle={styles.dropdown_text}
              searchPlaceholder={'Enter School District Name'}
              placeholder={'Select School District'}
              containerStyle={styles.dropdown_container}
              listMode={'FLATLIST'}
              tickIconStyle={styles.dropdown_tick}
              listItemLabelStyle={styles.dropdown_item}
              searchContainerStyle={styles.dropdown_search_container}
              searchTextInputStyle={styles.dropdown_search_text}
            ></DropDownPicker>
          )}
          {Platform.OS !== 'web' && (
            <View style={styles.checkbox_container}>
              <BouncyCheckbox
                size={24}
                fillColor={Colors.accent}
                unfillColor="transparent"
                disableText
                iconStyle={{ borderColor: Colors.black }}
                isChecked={isChecked}
                disableBuiltInState
                onPress={async () => {
                  setToggleCheckBox(!isChecked)
                }}
              />
              <Text style={styles.save_text}>Save Login Information</Text>
            </View>
          )}
          <CustomButton
            onPress={() => {
              if (!isLoading) onLogin()
            }}
            text={'Login'}
            backgroundColor={
              !isLoading ? Colors.navy : 'rgba(100, 100, 100, 0.6)'
            }
            textColor={Colors.white}
            fontFamily="Inter_800ExtraBold"
            containerStyle={styles.button_container}
          ></CustomButton>
          <ActivityIndicator
            color={Colors.secondary}
            animating={isLoading}
            size="large"
          />
          <View
            style={{
              alignItems: 'center',
              position: 'absolute',
              bottom: 20
            }}
          >
            <Text style={styles.credit}>by Richard Yin &copy; 2022</Text>
            <FontAwesome.Button
              name="instagram"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.black
              }}
              underlayColor="none"
              activeOpacity={0.5}
              size={28}
              onPress={() => openInstagram()}
            ></FontAwesome.Button>
          </View>
        </KeyboardAvoidingView>
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

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  welcome: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10
  },
  checkbox_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  input: {
    width: 250,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 5,
    marginBottom: 10
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.black,
    height: 50,
    width: 250,
    marginBottom: 10,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5
  },
  dropdown_text: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  dropdown_container: {
    width: 250
  },
  dropdown_item: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'Inter_600SemiBold'
  },
  dropdown_tick: {
    marginLeft: 10
  },
  dropdown_search_container: {
    padding: 10,
    borderBottomWidth: 0
  },
  dropdown_search_text: {
    fontFamily: 'Inter_400Regular'
  },
  loading: {
    margin: 'auto'
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0,
    marginBottom: 10
  },
  save_text: {
    marginLeft: 8,
    fontFamily: 'Inter_400Regular'
  },
  credit: {
    fontFamily: 'Inter_200ExtraLight',
    fontSize: 12,
    textAlign: 'center'
  }
})

async function save(key: string, value: string) {
  if (value === null) return
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key: string) {
  return await SecureStore.getItemAsync(key)
}

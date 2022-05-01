import React, { useContext, useState } from 'react'
import {
  Alert,
  TextInput,
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import StudentVue from 'studentvue'
import * as SecureStore from 'expo-secure-store'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import AppContext from '../contexts/AppContext'
import { LightTheme } from '../theme/LightTheme'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import GradeUtil from '../gradebook/GradeUtil'

const colors = LightTheme.colors

const DISTRICT_URL = 'https://md-mcps-psv.edupoint.com/'

type loginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>

const Login = () => {
  const navigation = useNavigation<loginScreenProp>()
  const {
    username,
    password,
    setUsername,
    setPassword,
    setClient,
    setMarks,
    setGradebook
  } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(false)

  let usernameLocal = username
  let passwordLocal = password

  savedCredentials()

  async function savedCredentials() {
    setUsername(await getValueFor('Username'))
    setPassword(await getValueFor('Password'))
  }

  async function onLogin() {
    setIsLoading(true)
    try {
      const client = await StudentVue.login(DISTRICT_URL, {
        username: usernameLocal,
        password: passwordLocal
      })
      const gradebook = await client.gradebook()
      const marks = await GradeUtil.convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
      setGradebook(gradebook)
    } catch (err) {
      Alert.alert('Error' + usernameLocal + passwordLocal, err.message)
      setIsLoading(false)
      return
    }
    setUsername(usernameLocal)
    setPassword(passwordLocal)
    if (isChecked) {
      save('Username', usernameLocal)
      save('Password', passwordLocal)
    }
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  return (
    <View style={styles.container}>
      <TextInput
        defaultValue={username}
        onChangeText={(u) => (usernameLocal = u)}
        placeholder={'Username'}
        style={styles.input}
      />
      <TextInput
        defaultValue={password}
        onChangeText={(p) => (passwordLocal = p)}
        placeholder={'Password'}
        secureTextEntry={true}
        style={styles.input}
      />
      <View style={styles.checkbox_container}>
        <BouncyCheckbox
          size={20}
          fillColor={colors.primary}
          unfillColor="white"
          disableText
          iconStyle={{ borderColor: colors.primary }}
          isChecked={isChecked}
          disableBuiltInState
          onPress={() => setToggleCheckBox(!isChecked)}
        />
        <Text style={{ marginLeft: 8 }}>Save login information</Text>
      </View>
      <CustomButton
        onPress={onLogin.bind(this)}
        text={'Login'}
        backgroundColor={colors.card}
        textColor="black"
        fontFamily="Inter_800ExtraBold"
        containerStyle={styles.button_container}
      ></CustomButton>
      <ActivityIndicator
        color={colors.primary}
        animating={isLoading}
        size="large"
      />
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkbox_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  input: {
    width: 220,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 10
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
  }
})

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key: string) {
  return await SecureStore.getItemAsync(key)
}

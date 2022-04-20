import React, { useContext, useState } from 'react'
import {
  Alert,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import StudentVue from 'studentvue'
import * as SecureStore from 'expo-secure-store'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import AppContext from '../components/AppContext'
import { LightTheme } from '../theme/LightTheme'

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
    setGradebook
  } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)

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
      setClient(client)
      setGradebook(gradebook)
    } catch (err) {
      Alert.alert('Error', err.message)
      return
    }
    setUsername(usernameLocal)
    setPassword(passwordLocal)
    save('Username', usernameLocal)
    save('Password', passwordLocal)
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
      <CustomButton
        onPress={onLogin.bind(this)}
        text={'Login'}
        backgroundColor={colors.card}
        textColor={colors.primary}
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
  }
})

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key: string) {
  return await SecureStore.getItemAsync(key)
}

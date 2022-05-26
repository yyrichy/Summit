import React, { useContext, useState } from 'react'
import {
  Alert,
  TextInput,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform
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

  if (
    Platform.OS !== 'web' &&
    username === undefined &&
    password === undefined
  ) {
    savedCredentials()
  }

  async function savedCredentials() {
    setUsername(await getValueFor('Username'))
    setPassword(await getValueFor('Password'))
  }

  async function onLogin() {
    setIsLoading(true)
    try {
      const client = await StudentVue.login(DISTRICT_URL, {
        username: username,
        password: password
      })
      const gradebook = await client.gradebook()
      const marks = await GradeUtil.convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
      setGradebook(gradebook)
    } catch (err) {
      Alert.alert('Error', err.message)
      setIsLoading(false)
      return
    }
    setUsername(username)
    setPassword(password)
    if (Platform.OS !== 'web' && isChecked) {
      save('Username', username)
      save('Password', password)
    }
    setIsLoading(false)
    navigation.navigate('Menu')
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
          <Text style={styles.welcome}>Welcome To{'\n'}ScholarHelper</Text>
        </SafeAreaView>
        <SafeAreaView style={styles.container}>
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
            onPress={onLogin.bind(this)}
            text={'Login'}
            backgroundColor={Colors.navy}
            textColor={Colors.white}
            fontFamily="Inter_800ExtraBold"
            containerStyle={styles.button_container}
          ></CustomButton>
          <ActivityIndicator
            color={Colors.secondary}
            animating={isLoading}
            size="large"
          />
        </SafeAreaView>
      </LinearGradient>
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
    width: 220,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 5,
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
  },
  save_text: {
    marginLeft: 8,
    fontFamily: 'Inter_400Regular'
  }
})

async function save(key: string, value: string) {
  if (value === null) return
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key: string) {
  return await SecureStore.getItemAsync(key)
}

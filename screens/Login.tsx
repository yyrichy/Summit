import React, { useState } from "react"
import { Alert, TextInput, View, StyleSheet } from "react-native"
import StudentVue from "studentvue"
import * as SecureStore from "expo-secure-store"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "./RootStackParams"
import { useNavigation } from "@react-navigation/native"
import CustomButton from "../components/CustomButton"

const DISTRICT_URL = "https://md-mcps-psv.edupoint.com/"

type loginScreenProp = StackNavigationProp<RootStackParamList, "Login">

const Login = () => {
  const navigation = useNavigation<loginScreenProp>()
  const [client, setClient] = useState(undefined)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const user = {
    username: username,
    password: password,
    client: client
  }

  savedCredentials()

  async function savedCredentials() {
    const u = (await getValueFor("Username")) || ""
    const p = (await getValueFor("Password")) || ""
    try {
      setClient(
        await StudentVue.login(DISTRICT_URL, { username: u, password: p })
      )
    } catch (err) {
      return
    }
    setUsername(u)
    setPassword(p)
    menu()
  }

  async function onLogin() {
    try {
      setClient(
        await StudentVue.login(DISTRICT_URL, {
          username: username,
          password: password
        })
      )
    } catch (err) {
      Alert.alert("Error", err.message)
      return
    }
    save("Username", username)
    save("Password", password)
    menu()
  }

  function menu() {
    navigation.navigate("Menu", { user: user })
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={(u) => setUsername(u)}
        placeholder={"Username"}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(p) => setPassword(p)}
        placeholder={"Password"}
        secureTextEntry={true}
        style={styles.input}
      />
      <CustomButton
        onPress={onLogin.bind(this)}
        text={"Login"}
        backgroundColor="#02a5c2"
      ></CustomButton>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: 220,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3EB489",
    marginBottom: 10
  }
})

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key: string) {
  return await SecureStore.getItemAsync(key)
}

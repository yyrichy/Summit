import React, { useState } from 'react';
import { Alert, Button, TextInput, View, StyleSheet } from 'react-native';
import StudentVue from 'studentvue';
import * as SecureStore from 'expo-secure-store';

const DISTRICT_URL = 'https://md-mcps-psv.edupoint.com/';

const Login = ({ navigation }) => {
  const [client, setClient] = useState(undefined);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = {
    username: username,
    password: password,
    client: client
  };

  savedCredentials();

  async function savedCredentials() {
    const u = await getValueFor('Username') || '';
    const p = await getValueFor('Password') || '';
    try {
      setClient(await StudentVue.login(DISTRICT_URL, { username: u, password: p }));
    } catch (err) {
      return;
    }
    setUsername(u);
    setPassword(p);
    menu();
  }

  async function onLogin() {
    try {
      setClient(await StudentVue.login(DISTRICT_URL, { username: username, password: password }));
      Alert.alert('a', user.username);
    } catch (err) {
      Alert.alert('Error', err.message);
      return;
    }
    save('Username', username);
    save('Password', password);
    menu();
  }

  function menu() {
    navigation.navigate('Menu', { user: user });
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={(u) => setUsername(u)}
        placeholder={'Username'}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(p) => setPassword(p)}
        placeholder={'Password'}
        secureTextEntry={true}
        style={styles.input}
      />
      <Button
        title={'Login'}
        style={styles.input}
        onPress={onLogin.bind(this)}
      />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 220,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#3EB489',
    marginBottom: 10,
  },
});

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  return await SecureStore.getItemAsync(key);
}
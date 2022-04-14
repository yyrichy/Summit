import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet } from 'react-native';
import StudentVue from 'studentvue';
import * as SecureStore from 'expo-secure-store';

const DISTRICT_URL = 'https://md-mcps-psv.edupoint.com/';

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.client = undefined;

    this.state = {
      username: '',
      password: '',
    };

    this.savedCredentials();
  }

  async savedCredentials() {
    const username = await getValueFor('Username') || '';
    const password = await getValueFor('Password') || '';
    try {
      const client = await StudentVue.login(DISTRICT_URL, { username: username, password: password });
      const info = await client.schoolInfo();
      Alert.alert('School Info', `${info.school.address} in ${info.school.city}`);
      this.props.navigation.navigate('Menu');
    } catch (err) {
      return;
    }
  }

  async onLogin() {
    const { username, password } = this.state;
    try {
      this.client = await StudentVue.login(DISTRICT_URL, { username: username, password: password });
      const info = await this.client.schoolInfo();
      Alert.alert('School Info', `${info.school.address} in ${info.school.city} 😁`);
    } catch (err) {
      Alert.alert('Error', err.message);
      return;
    }
    save('Username', username);
    save('Password', password);
    this.props.navigation.navigate('Menu')
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        <Button
          title={'Login'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
        />
      </View>
    );
  }
}

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
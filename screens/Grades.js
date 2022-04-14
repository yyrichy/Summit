import React, { Component, useContext } from 'react';
import AppContext from '../components/AppContext';
import { View, Text, Alert } from 'react-native';

const Grades = async () => {
  const context = useContext(AppContext);
/*   const user = context.user
  const username = user.username;
  const password = user.password;
  const client = user.client;
  Alert.alert('.', password) */

  return (
    <View>
      <Text>This is the grades screen</Text>
    </View>
  )
}

export default Grades;
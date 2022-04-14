import React, { useContext } from 'react';
import AppContext from '../components/AppContext';
import { View, Text } from 'react-native';

function Grades () {
  const context = useContext(AppContext);
/*   const user = context.user
  const username = user.username;
  const password = user.password;
  const client = user.client;
  Alert.alert('.', password) */

  return (
    <View>
      <Text>This is the grades screen {context.username}</Text>
    </View>
  )
}

export default Grades;
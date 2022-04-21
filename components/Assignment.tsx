import React from 'react'
import { TextInput } from 'react-native'
import { StyleSheet, View, Text } from 'react-native'

function Assignment(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.name}>{props.name}</Text>
      <TextInput
        defaultValue={props.mark}
        placeholder={'Mark'}
        style={styles.mark}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(221,221,221)',
    borderRadius: 15,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7
  },
  name: {
    color: '#121212',
    fontSize: 11,
    marginLeft: 20
  },
  mark: {
    height: 60,
    borderWidth: 0,
    alignSelf: 'center',
    marginRight: 20
  }
})

export default Assignment

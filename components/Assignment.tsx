import React from 'react'
import { TextInput } from 'react-native'
import { StyleSheet, View, Text } from 'react-native'

function Assignment(props) {
  let pointsEarned: number = 0,
    pointsTotal: number = 0
  if (props.value !== 'Not Graded') {
    const points = props.points.split('/').map((p) => p.replace(/\s+/g, ''))
    pointsEarned = parseFloat(points[0])
    pointsTotal = parseFloat(points[1])
  } else {
    pointsTotal = parseFloat(
      props.points.substring(0, props.points.indexOf(' '))
    )
  }

  return (
    <View style={[styles.container, props.style]}>
      <Text numberOfLines={2} style={styles.name}>
        {props.name}
      </Text>
      <TextInput
        defaultValue={`${pointsEarned.toString()} / ${pointsTotal.toString()}`}
        placeholder={'Mark'}
        style={styles.mark}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(221,221,221)',
    borderRadius: 10,
    height: 30,
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
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'left',
    flex: 1
  },
  mark: {
    height: 60,
    borderWidth: 0,
    alignSelf: 'center',
    marginRight: 10
  }
})

export default Assignment

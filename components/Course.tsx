import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

function CourseComponent(props) {
  const mark = parseFloat(props.mark)
  let color = '#121212'
  if (mark > 89.5) {
    color = 'purple'
  } else if (mark > 79.5) {
    color = 'green'
  } else if (mark > 69.5) {
    color = 'yellow'
  } else if (mark > 59.5) {
    color = 'orange'
  } else if (mark > 49.5) {
    color = 'red'
  }

  return (
    <View style={[styles.container, props.style]}>
      <Text numberOfLines={1} style={styles.name}>
        {props.name}
      </Text>
      <Text
        style={[
          styles.mark,
          {
            color: color,
            textShadowColor: 'black',
            textShadowRadius: 2
          }
        ]}
      >
        {props.mark}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(221,221,221)',
    borderRadius: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7
  },
  name: {
    color: '#121212',
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'left',
    flex: 1
  },
  mark: {
    color: '#121212',
    fontSize: 32,
    alignSelf: 'center',
    marginRight: 15
  }
})

export default CourseComponent

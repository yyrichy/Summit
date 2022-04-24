import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { LightTheme } from '../theme/LightTheme'

function CourseComponent(props) {
  const mark = parseFloat(props.mark)
  let color = 'black'
  if (mark > 89.5) {
    color = LightTheme.colors.primary
  } else if (mark > 79.5) {
    color = 'green'
  } else if (mark > 69.5) {
    color = 'orange'
  } else if (mark > 59.5) {
    color = 'red'
  } else if (mark > 49.5) {
    color = 'gray'
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
            color: color
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
    backgroundColor: LightTheme.colors.card_background,
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
    color: 'black',
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'left',
    flex: 1
  },
  mark: {
    color: 'black',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 32,
    alignSelf: 'center',
    marginRight: 15
  }
})

export default CourseComponent

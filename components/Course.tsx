import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Colors } from '../colors/Colors'

function CourseComponent(props) {
  const mark = parseFloat(props.mark)
  let color = 'black'
  if (mark >= 89.5) {
    color = Colors.accent
  } else if (mark >= 79.5) {
    color = 'green'
  } else if (mark >= 69.5) {
    color = 'orange'
  } else if (mark >= 59.5) {
    color = 'red'
  } else if (mark >= 49.5) {
    color = 'gray'
  }

  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.period_number}>{`0${props.period}`}</Text>
      <View style={styles.course_info_container}>
        <Text numberOfLines={1} style={styles.name}>
          {props.name}
        </Text>
        <Text numberOfLines={1} style={styles.teacher}>
          {props.teacher}
        </Text>
      </View>
      <Text
        style={[
          styles.mark,
          {
            color: color
          }
        ]}
      >
        {isNaN(parseFloat(props.mark)) ? 'N/A' : props.mark}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    marginTop: 7,
    padding: 7
  },
  period_number: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32
  },
  course_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 7,
    flex: 1
  },
  name: {
    color: 'black',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    marginRight: 14,
    marginLeft: 7,
    lineHeight: 18 * 0.75,
    paddingTop: 18 - 18 * 0.75,
    textAlign: 'left'
  },
  teacher: {
    color: 'black',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginRight: 14,
    marginLeft: 7,
    lineHeight: 12 * 0.75,
    paddingTop: 12 - 12 * 0.75,
    marginTop: 4,
    textAlign: 'left'
  },
  mark: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    alignSelf: 'center'
  }
})

export default CourseComponent

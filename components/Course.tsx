import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../colors/Colors'
import {
  calculateLetterGrade,
  calculateMarkColor,
  prependZero
} from '../gradebook/GradeUtil'

function Course(props) {
  const mark: number = parseFloat(props.mark)

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
      activeOpacity={0.2}
    >
      <Text style={styles.period_number}>{prependZero(props.period)}</Text>
      <View style={styles.course_info_container}>
        <Text numberOfLines={1} style={styles.name}>
          {props.name}
        </Text>
        <Text numberOfLines={1} style={styles.teacher}>
          {props.teacher}
        </Text>
      </View>
      <Text style={[styles.mark]}>
        {isNaN(parseFloat(props.mark)) ? 'N/A' : props.mark}
      </Text>
      {!isNaN(parseFloat(props.mark)) && (
        <Text
          style={[
            styles.letter_grade,
            {
              color: calculateMarkColor(mark)
            }
          ]}
        >
          {calculateLetterGrade(mark)}
        </Text>
      )}
    </TouchableOpacity>
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
    marginVertical: 5,
    padding: 10
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
    color: Colors.navy,
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    marginRight: 14,
    marginLeft: 7
  },
  teacher: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginRight: 14,
    marginLeft: 7,
    marginTop: 4
  },
  mark: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 30
  },
  letter_grade: {
    marginLeft: 7,
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 30
  }
})

export default Course

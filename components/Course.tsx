import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native'
import { Colors } from '../colors/Colors'
import {
  calculateLetterGrade,
  calculateMarkColor
} from '../gradebook/GradeUtil'

function Course(props) {
  const mark: number = parseFloat(props.mark)

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
      activeOpacity={0.2}
    >
      <Text style={styles.period_number}>{('0' + props.period).slice(-2)}</Text>
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
    backgroundColor: Colors.off_white,
    borderRadius: 15,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.secondary
  },
  period_number: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    lineHeight: 36
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
    marginLeft: 7,
    lineHeight: 18 * 0.75,
    textAlign: 'left',
    ...Platform.select({
      web: {
        paddingBottom: 12 - 12 * 0.75
      },
      default: {
        paddingTop: 18 - 18 * 0.75
      }
    })
  },
  teacher: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginRight: 14,
    marginLeft: 7,
    lineHeight: 12 * 0.75,
    marginTop: 4,
    textAlign: 'left',
    ...Platform.select({
      web: {
        paddingBottom: 2
      },
      default: {
        paddingTop: 12 - 12 * 0.75
      }
    })
  },
  mark: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 30,
    lineHeight: 36
  },
  letter_grade: {
    marginLeft: 7,
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 30,
    lineHeight: 36
  }
})

export default Course

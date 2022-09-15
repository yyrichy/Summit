import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Colors } from '../colors/Colors'
import GradeUtil from '../gradebook/GradeUtil'

function CourseComponent(props) {
  const mark = parseFloat(props.mark)

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
      <Text style={[styles.mark]}>
        {isNaN(parseFloat(props.mark)) ? 'N/A' : props.mark}
      </Text>
      {!isNaN(parseFloat(props.mark)) && (
        <Text
          style={[
            styles.letter_grade,
            {
              color: GradeUtil.calculateMarkColor(mark)
            }
          ]}
        >
          {GradeUtil.calculateLetterGrade(mark)}
        </Text>
      )}
    </View>
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
    marginHorizontal: 7,
    marginTop: 10,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.secondary
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
    fontSize: 18,
    marginRight: 14,
    marginLeft: 7,
    lineHeight: 18 * 0.75,
    textAlign: 'left',
    paddingBottom: 12 - 12 * 0.75
  },
  teacher: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginRight: 14,
    marginLeft: 7,
    lineHeight: 12 * 0.75,
    paddingBottom: 2,
    marginTop: 4,
    textAlign: 'left'
  },
  mark: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 28,
    alignSelf: 'center'
  },
  letter_grade: {
    marginLeft: 7,
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    alignSelf: 'center'
  }
})

export default CourseComponent

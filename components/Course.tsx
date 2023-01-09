import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../colors/Colors'
import {
  calculateLetterGrade,
  calculateMarkColor,
  prependZero
} from '../gradebook/GradeUtil'

type Props = {
  mark: string
  onPress: any
  period: number
  name: string
  teacher: string
}

const Course: React.FC<Props> = ({ mark, onPress, period, name, teacher }) => {
  const markAsNumber: number = parseFloat(mark)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.2}
    >
      <Text style={styles.period_number}>{prependZero(period)}</Text>
      <View style={styles.course_info_container}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.teacher}>
          {teacher}
        </Text>
      </View>
      <Text style={styles.mark}>{isNaN(markAsNumber) ? 'N/A' : mark}</Text>
      {!isNaN(markAsNumber) && (
        <Text
          style={[
            styles.letter_grade,
            {
              color: calculateMarkColor(markAsNumber)
            }
          ]}
        >
          {calculateLetterGrade(markAsNumber)}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
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

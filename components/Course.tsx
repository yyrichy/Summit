import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import {
  calculateLetterGrade,
  calculateMarkColor,
  parseCourseName,
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
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.2}
    >
      <Text style={styles.period_number}>{period}</Text>
      <View style={styles.course_info_container}>
        <Text style={styles.name}>{parseCourseName(name)}</Text>
        <Text
          numberOfLines={1}
          style={[styles.teacher, { color: theme.colors.onSurface }]}
        >
          {teacher}
        </Text>
      </View>

      {!isNaN(markAsNumber) && (
        <>
          <Text style={styles.mark}>{parseFloat(mark).toFixed(1)}</Text>
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
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth
  },
  period_number: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    marginHorizontal: 4
  },
  course_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 10,
    flex: 1
  },
  name: {
    color: Colors.navy,
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  teacher: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 3
  },
  mark: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 24
  },
  letter_grade: {
    marginLeft: 10,
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 30,
    marginRight: 2
  }
})

export default Course

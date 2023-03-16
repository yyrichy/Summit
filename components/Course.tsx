import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import { calculateLetterGrade, calculateMarkColor, parseCourseName } from '../gradebook/GradeUtil'
import { round } from '../util/Util'

type Props = {
  mark: number
  onPress: (event: GestureResponderEvent) => void
  period: number
  name: string
  teacher: string
  room: string
}

const Course: React.FC<Props> = ({ mark, onPress, period, name, teacher, room }) => {
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? Colors.dark_gray : Colors.light_yellow_white,
          borderColor: theme.colors.outlineVariant
        }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.period_number, { color: theme.colors.onSurface }]}>{period}</Text>
      <View style={styles.course_info_container}>
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>
          {parseCourseName(name)}
        </Text>
        <Text numberOfLines={1} style={[styles.teacher, { color: theme.colors.onSurfaceVariant }]}>
          {teacher} {'\u2022'} {room}
        </Text>
      </View>
      {!isNaN(mark) && (
        <>
          <Text style={styles.mark}>{round(mark, 2)}</Text>
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
    padding: 12
  },
  period_number: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    marginHorizontal: 4
  },
  course_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 8,
    flex: 1
  },
  name: {
    color: Colors.navy,
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  teacher: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2
  },
  mark: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: Colors.medium_gray
  },
  letter_grade: {
    marginLeft: 12,
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    marginRight: 4
  }
})

export default Course

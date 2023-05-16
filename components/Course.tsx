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
          backgroundColor: theme.colors.surface
        }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.period_number, { color: theme.colors.onSurface }]}>{period}</Text>
      <View style={styles.course_info_container}>
        <Text numberOfLines={1} style={[styles.name, { color: theme.colors.onSurface }]}>
          {parseCourseName(name)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            style={[styles.teacher, { color: theme.colors.onSurfaceVariant }]}
          >
            {teacher} {'\u00B7'} {room}
          </Text>
        </View>
      </View>
      {!isNaN(mark) && (
        <>
          <View
            style={{
              backgroundColor: theme.colors.surfaceVariant,
              padding: 8,
              borderRadius: 12,
              marginRight: 6
            }}
          >
            <Text style={[styles.mark, { color: theme.colors.onSurfaceVariant }]}>
              {round(mark, 2)}
            </Text>
          </View>
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
    padding: 16
  },
  period_number: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    marginHorizontal: 4
  },
  course_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 12,
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
    marginHorizontal: 4
  }
})

export default Course

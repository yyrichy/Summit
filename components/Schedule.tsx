import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import { parseScheduleCourseName } from '../gradebook/GradeUtil'
import { formatAMPM } from '../util/Util'

type Props = {
  name: string
  period: number
  teacher: string
  start?: Date
  end?: Date
  room?: string
}

const ScheduleComponent: React.FC<Props> = ({ name, period, teacher, start, end, room }) => {
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Text style={[styles.period_number, { color: theme.colors.onSurface }]}>{period}</Text>
      <View
        style={[styles.course_info_container, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        <Text numberOfLines={2} style={[styles.name, { color: theme.colors.onSurface }]}>
          {parseScheduleCourseName(name)}
        </Text>
        <View style={styles.info_container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text numberOfLines={1} style={[styles.type, { color: theme.colors.onSurfaceVariant }]}>
              {teacher}
              {room && ` \u00B7 ${room}`}
            </Text>
          </View>
          {start && end && (
            <Text numberOfLines={1} style={[styles.type, { color: theme.colors.onSurfaceVariant }]}>
              {formatAMPM(start)} - {formatAMPM(end)}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  period_number: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    marginHorizontal: 8,
    width: 24
  },
  course_info_container: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center'
  },
  name: {
    color: Colors.black,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    textAlign: 'left'
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  type: {
    color: Colors.medium_gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2
  }
})

export default ScheduleComponent

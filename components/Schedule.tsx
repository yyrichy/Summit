import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import { formatAMPM, prependZero } from '../gradebook/GradeUtil'

type Props = {
  name: string
  period: number
  teacher: string
  start?: Date
  end?: Date
  room?: string
}

const ScheduleComponent: React.FC<Props> = ({
  name,
  period,
  teacher,
  start,
  end,
  room
}) => {
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Text style={styles.period_number}>{prependZero(period)}</Text>
      <View
        style={[
          styles.course_info_container,
          { backgroundColor: theme.colors.surfaceVariant }
        ]}
      >
        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>
        <View style={styles.info_container}>
          <Text
            numberOfLines={1}
            style={[
              styles.type,
              { flex: 1, color: theme.colors.onSurfaceVariant }
            ]}
          >
            {teacher}
            {room && ` \u2022 ${room}`}
          </Text>
          {start && end && (
            <Text
              numberOfLines={1}
              style={[styles.type, { color: theme.colors.onSurfaceVariant }]}
            >
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
    alignItems: 'center'
  },
  period_number: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    marginHorizontal: 8,
    width: 45
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
    justifyContent: 'flex-start',
    flex: 1
  },
  type: {
    color: Colors.onyx_gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4
  }
})

export default ScheduleComponent

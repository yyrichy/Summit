import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Colors } from '../colors/Colors'
import { formatAMPM, prependZero } from '../gradebook/GradeUtil'

type Props = {
  name: string
  period: number
  teacher: string
  start: Date
  end: Date
}

const ScheduleComponent: React.FC<Props> = ({
  name,
  period,
  teacher,
  start,
  end
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.period_number}>{prependZero(period)}</Text>
      <View style={styles.course_info_container}>
        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>
        <View style={styles.info_container}>
          <Text numberOfLines={1} style={[styles.type, { flex: 1 }]}>
            {teacher}
          </Text>
          <Text numberOfLines={1} style={styles.type}>
            {formatAMPM(start)} - {formatAMPM(end)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
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
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    borderRadius: 10,
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

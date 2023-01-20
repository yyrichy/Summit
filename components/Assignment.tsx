import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  LayoutAnimation,
  UIManager,
  Animated
} from 'react-native'
import {
  calculateMarkColor,
  updatePoints,
  deleteAssignment,
  isNumber
} from '../gradebook/GradeUtil'
import AppContext from '../contexts/AppContext'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Badge, useTheme } from 'react-native-paper'
import AssignmentChip from './AssignmentChip'
import { Swipeable } from 'react-native-gesture-handler'
import { dateRelativeToToday } from '../util/Util'

type Props = {
  courseName: string
  name: string
  style?: StyleProp<ViewStyle>
  onPress?: any
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Assignment: React.FC<Props> = ({ courseName, name, style }) => {
  const theme = useTheme()
  const { marks, setMarks } = useContext(AppContext)
  const [isDropdown, setIsDropdown] = useState(false)
  const course = marks.courses.get(courseName)
  const assignment = course.assignments.find((a) => a.name === name)
  const pointsString = isNaN(assignment.points)
    ? ''
    : assignment.points.toString()
  const totalString = isNaN(assignment.total) ? '' : assignment.total.toString()
  const score: number = (assignment.points / assignment.total) * 100
  const hasScore: boolean = !isNaN(score)

  const update = (input: string, type: 'total' | 'earned') => {
    if (type === 'total') {
      total.current = input
    } else {
      points.current = input
    }
    setMarks(updatePoints(marks, courseName, name, parseFloat(input), type))
  }

  const getWidth = (n: number) => {
    const min = 34
    if (isNaN(n)) return min
    return Math.max(n.toString().length * 15, min)
  }

  const points = useRef(pointsString)
  const total = useRef(totalString)

  useEffect(() => {
    points.current = pointsString
    total.current = totalString
  }, [marks])

  const transition = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsDropdown(!isDropdown)
  }

  const getModifiedColor = (modified: boolean) => {
    if (modified) {
      return Colors.dark_middle_blue_green
    } else {
      return Colors.black
    }
  }

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1]
    })
    return (
      <Animated.View style={{ transform: [{ translateX: trans }] }}>
        <MaterialCommunityIcons.Button
          name="delete-forever"
          backgroundColor="transparent"
          iconStyle={{
            color: theme.colors.error
          }}
          style={{
            paddingRight: 0,
            margin: 0,
            marginTop: 4
          }}
          underlayColor="none"
          activeOpacity={0.2}
          size={36}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setMarks(deleteAssignment(marks, courseName, name))
          }}
        />
      </Animated.View>
    )
  }

  return (
    <Swipeable renderLeftActions={renderLeftActions}>
      <TouchableOpacity
        style={[
          styles.container,
          style,
          {
            borderLeftColor: hasScore ? calculateMarkColor(score) : Colors.white
          }
        ]}
        onPress={transition}
      >
        <View style={[styles.horizontal_container]}>
          <View style={styles.assignment_info_container}>
            <Text numberOfLines={1} style={[styles.name]}>
              {name}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.category, { color: theme.colors.onSurface }]}
            >
              {assignment.category} - {assignment.date.due.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.input_container}>
            <TextInput
              value={points.current}
              placeholder={'__'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              autoComplete={'off'}
              placeholderTextColor={Colors.secondary}
              style={[
                styles.mark,
                {
                  color: getModifiedColor(assignment.modified),
                  width: getWidth(assignment.points)
                }
              ]}
              onChangeText={(input) => {
                if (isNumber(input) || input === '') update(input, 'earned')
              }}
            />
            <Text
              style={[
                styles.dash,
                { color: getModifiedColor(assignment.modified) }
              ]}
            >
              /
            </Text>
            <TextInput
              value={total.current}
              placeholder={'__'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              autoComplete={'off'}
              placeholderTextColor={Colors.secondary}
              style={[
                styles.mark,
                {
                  color: getModifiedColor(assignment.modified),
                  width: getWidth(assignment.total)
                }
              ]}
              onChangeText={(input) => {
                if (isNumber(input) || input === '') update(input, 'total')
              }}
            />
          </View>
        </View>
        {isDropdown && (
          <View style={{ marginTop: 4, padding: 4, paddingBottom: 0 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              {assignment.date.start && (
                <AssignmentChip
                  icon="calendar-arrow-right"
                  text={dateRelativeToToday(assignment.date.start)}
                  style={{ marginRight: 4 }}
                />
              )}
              {assignment.status.length !== 0 && (
                <AssignmentChip
                  icon="pencil-outline"
                  text={assignment.status}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              {assignment.date.due && (
                <View>
                  <AssignmentChip
                    icon="calendar-clock"
                    text={dateRelativeToToday(assignment.date.due)}
                    style={{ marginRight: 4 }}
                    showBadge={
                      assignment.date.due < new Date() &&
                      (!hasScore || score <= 50)
                    }
                  />
                </View>
              )}
              {assignment.notes.length !== 0 && (
                <AssignmentChip
                  icon="note-outline"
                  text={assignment.notes}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 4,
    overflow: 'hidden',
    padding: 10,
    backgroundColor: Colors.white,
    borderLeftWidth: 4
  },
  horizontal_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  assignment_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    marginRight: 4
  },
  name: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  category: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mark: {
    fontSize: 23,
    fontFamily: 'Inter_500Medium',
    alignSelf: 'center',
    outlineStyle: 'none'
  },
  dash: {
    fontSize: 20,
    alignSelf: 'center',
    textAlignVertical: 'center',
    marginRight: 6
  },
  dropdown_text_value: {
    fontFamily: 'Inter_400Regular',
    flex: 1,
    fontSize: 16,
    marginLeft: 10
  },
  detail_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  }
})

export default Assignment

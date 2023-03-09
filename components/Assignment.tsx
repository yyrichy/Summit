import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  UIManager,
  Animated as ReactNativeAnimated,
  GestureResponderEvent
} from 'react-native'
import { calculateMarkColor, updatePoints, deleteAssignment } from '../gradebook/GradeUtil'
import AppContext from '../contexts/AppContext'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Divider, useTheme } from 'react-native-paper'
import { Swipeable } from 'react-native-gesture-handler'
import { dateRelativeToToday, isNumber } from '../util/Util'
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight
} from 'react-native-reanimated'
import { format } from 'date-fns'

type Props = {
  courseName: string
  name: string
  style?: StyleProp<ViewStyle>
  onPress?: (event: GestureResponderEvent) => void
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Assignment: React.FC<Props> = ({ courseName, name, style }) => {
  const theme = useTheme()
  const { marks, setMarks } = useContext(AppContext)
  const [isDropdown, setIsDropdown] = useState(false)
  const course = marks.courses.get(courseName)
  const assignment = course.assignments.find((a) => a.name === name)
  const pointsString = isNaN(assignment.points) ? '' : assignment.points.toString()
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

  const points = useRef(pointsString)
  const total = useRef(totalString)

  useEffect(() => {
    points.current = pointsString
    total.current = totalString
  }, [marks])

  const transition = () => {
    setIsDropdown(!isDropdown)
  }

  const getModifiedColor = (modified: boolean) => {
    if (modified) {
      return Colors.dark_middle_blue_green
    } else {
      return theme.dark ? theme.colors.onSurface : Colors.black
    }
  }

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1]
    })
    return (
      <ReactNativeAnimated.View
        style={{ transform: [{ translateX: trans }], justifyContent: 'center' }}
      >
        <MaterialCommunityIcons.Button
          name="delete-forever"
          backgroundColor="transparent"
          iconStyle={{
            color: theme.colors.error
          }}
          style={{
            padding: 0,
            margin: 0
          }}
          underlayColor="none"
          size={40}
          onPress={() => setMarks(deleteAssignment(marks, courseName, name))}
        />
      </ReactNativeAnimated.View>
    )
  }

  return (
    <Animated.View
      entering={LightSpeedInLeft}
      exiting={LightSpeedOutRight}
      layout={Layout.springify()}
    >
      <Swipeable renderLeftActions={renderLeftActions}>
        <TouchableOpacity
          style={[
            styles.container,
            style,
            hasScore
              ? {
                  borderLeftColor: calculateMarkColor(score),
                  borderLeftWidth: 3,
                  borderBottomColor: theme.colors.outlineVariant,
                  borderTopColor: theme.colors.outlineVariant,
                  borderRightColor: theme.colors.outlineVariant
                }
              : {
                  borderColor: theme.colors.outlineVariant
                },
            { backgroundColor: theme.dark ? Colors.dark_gray : Colors.light_yellow_white }
          ]}
          onPress={transition}
        >
          <View style={styles.horizontal_container}>
            <View style={styles.assignment_info_container}>
              <Text
                numberOfLines={!isDropdown ? 1 : 2}
                style={[styles.name, { color: theme.colors.onSurfaceVariant }]}
              >
                {name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 4,
                  alignItems: 'center'
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.category, { color: theme.colors.onSurface }]}
                >
                  {assignment.category}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.category,
                    {
                      color: theme.colors.onSurface,
                      fontSize: 8,
                      marginHorizontal: 4
                    }
                  ]}
                >
                  {'\u2022'}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.category, { color: theme.colors.onSurface, flexShrink: 1 }]}
                >
                  {format(assignment.date.due, 'M/dd/yy')}
                </Text>
              </View>
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
                    marginRight: 6
                  }
                ]}
                onChangeText={(input) => {
                  if (isNumber(input) || input === '') update(input, 'earned')
                }}
              />
              <Text style={[styles.dash, { color: getModifiedColor(assignment.modified) }]}>/</Text>
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
                    marginLeft: 6
                  }
                ]}
                onChangeText={(input) => {
                  if (isNumber(input) || input === '') update(input, 'total')
                }}
              />
            </View>
          </View>
          {isDropdown && (
            <Animated.View
              style={{
                marginTop: 6,
                padding: 4
              }}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(500)}
            >
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between'
                  }}
                >
                  <View>
                    <Text style={styles.assignment_property_label}>START</Text>
                    <Text
                      style={[
                        styles.assignment_property_value,
                        { color: theme.colors.onSurfaceVariant }
                      ]}
                    >
                      {dateRelativeToToday(assignment.date.start)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.assignment_property_label}>DUE</Text>
                    <Text
                      style={[
                        styles.assignment_property_value,
                        { color: theme.colors.onSurfaceVariant }
                      ]}
                    >
                      {dateRelativeToToday(assignment.date.due)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.assignment_property_label}>STATUS</Text>
                    <Text
                      style={[
                        styles.assignment_property_value,
                        { color: theme.colors.onSurfaceVariant }
                      ]}
                    >
                      {assignment.status}
                    </Text>
                  </View>
                </View>
              </View>
              {assignment.notes.length > 0 && (
                <>
                  <Divider style={{ marginVertical: 8 }} />
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: Colors.secondary,
                        marginRight: 6,
                        fontFamily: 'Inter_400Regular'
                      }}
                    >
                      NOTES
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        fontFamily: 'Inter_400Regular'
                      }}
                    >
                      {assignment.notes}
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
          )}
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 5,
    overflow: 'hidden',
    padding: 10
  },
  horizontal_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  assignment_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    marginRight: 6
  },
  name: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  category: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    maxWidth: '50%'
  },
  mark: {
    fontSize: 24,
    fontFamily: 'Inter_500Medium',
    alignSelf: 'center',
    flexShrink: 1
  },
  dash: {
    fontSize: 20,
    alignSelf: 'center',
    textAlignVertical: 'center'
  },
  assignment_property_label: {
    fontFamily: 'Inter_400Regular',
    color: Colors.secondary,
    fontSize: 12
  },
  assignment_property_value: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14
  }
})

export default memo(Assignment)

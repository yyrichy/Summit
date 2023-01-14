import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
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
  UIManager
} from 'react-native'
import {
  calculateMarkColor,
  updatePoints,
  deleteAssignment,
  isNumber
} from '../gradebook/GradeUtil'
import AppContext from '../contexts/AppContext'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'react-native-paper'
import { enUS } from 'date-fns/locale'
import { formatRelative } from 'date-fns'

const formatRelativeLocale = {
  lastWeek: "'Last' eeee",
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'Next' eeee",
  other: 'MM/dd/yyyy'
}

const locale = {
  ...enUS,
  formatRelative: (token) => formatRelativeLocale[token]
}

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
  const totalWeight: number = Array.from(course.categories.values()).reduce(
    (p, c) => (isNaN(c.value) ? p : p + c.weight),
    0
  )
  const score: number = (assignment.points / assignment.total) * 100
  const hasScore: boolean = !isNaN((assignment.points / assignment.total) * 100)

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

  const ref = useRef<TouchableOpacity>()
  const setOpacityTo = useCallback((value) => {
    // Redacted: animation related code
    if (!ref.current) return
    ref.current.setNativeProps({
      opacity: value
    })
  }, [])
  const transition = () => {
    setOpacityTo(0.2)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      setOpacityTo(1)
    })
    setIsDropdown(!isDropdown)
  }

  const getModifiedColor = (modified: boolean) => {
    if (modified) {
      return Colors.dark_middle_blue_green
    } else {
      return Colors.black
    }
  }

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.container,
        style,
        hasScore
          ? {
              borderLeftColor: calculateMarkColor(score),
              borderLeftWidth: 4
            }
          : {}
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
        <View style={styles.dropdown_container}>
          <View style={{ flex: 1 }}>
            {assignment.date.start && (
              <View style={styles.detail_container}>
                <MaterialIcons name={'not-started'} size={30} />
                <Text style={styles.dropdown_text_value}>
                  {formatRelative(assignment.date.start, new Date(), {
                    locale: locale
                  })}
                </Text>
              </View>
            )}
            {assignment.date.due && (
              <View style={styles.detail_container}>
                <MaterialCommunityIcons name={'timer-outline'} size={30} />
                <Text style={styles.dropdown_text_value}>
                  {formatRelative(assignment.date.due, new Date(), {
                    locale: locale
                  })}
                </Text>
              </View>
            )}
            <View style={styles.detail_container}>
              <MaterialIcons name={'edit'} size={30} />
              <Text style={styles.dropdown_text_value}>
                {assignment.status}
              </Text>
            </View>
            {assignment.notes.length !== 0 && (
              <View style={styles.detail_container}>
                <MaterialIcons name={'notes'} size={30} />
                <Text style={styles.dropdown_text_value}>
                  {assignment.notes}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'column-reverse' }}>
            <MaterialCommunityIcons.Button
              name="delete-forever"
              backgroundColor="transparent"
              iconStyle={{
                color: theme.colors.error
              }}
              style={{ paddingRight: 0, margin: 0 }}
              underlayColor="none"
              activeOpacity={0.2}
              size={36}
              onPress={() =>
                setMarks(deleteAssignment(marks, courseName, name))
              }
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 4,
    overflow: 'hidden',
    padding: 10,
    backgroundColor: Colors.white
  },
  horizontal_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdown_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
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
    fontSize: 14,
    marginTop: 4
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mark: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
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

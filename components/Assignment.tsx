import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  StyleProp,
  ViewStyle
} from 'react-native'
import {
  calculateMarkColor,
  updatePoints,
  deleteAssignment,
  isNumber,
  roundTo,
  calculateLetterGrade
} from '../gradebook/GradeUtil'
import AppContext from '../contexts/AppContext'
import { Colors } from '../colors/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'

type Props = {
  course: string
  name: string
  style?: StyleProp<ViewStyle>
  onPress: any
}

const Assignment: React.FC<Props> = ({ course, name, style, onPress }) => {
  const { marks, setMarks } = useContext(AppContext)
  const [isDropdown, setIsDropdown] = useState(false)
  const assignment = marks.courses
    .get(course)
    .assignments.find((a) => a.name === name)
  const pointsString = isNaN(assignment.points)
    ? ''
    : assignment.points.toString()
  const totalString = isNaN(assignment.total) ? '' : assignment.total.toString()
  const totalWeight: number = Array.from(
    marks.courses.get(course).categories.values()
  ).reduce((p, c) => (isNaN(c.value) ? p : p + c.weight), 0)
  const score: number = (assignment.points / assignment.total) * 100
  const hasScore: boolean = !isNaN((assignment.points / assignment.total) * 100)

  const update = (input: string, type: 'total' | 'earned') => {
    if (type === 'total') {
      total.current = input
    } else {
      points.current = input
    }
    setMarks(updatePoints(marks, course, name, parseFloat(input), type))
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

  return (
    <View
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
    >
      <View style={[styles.horizontal_container, { height: 52 }]}>
        <TouchableOpacity
          onPress={() => {
            onPress()
            setIsDropdown(!isDropdown)
          }}
          activeOpacity={0.5}
          style={styles.assignment_info_container}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.navy
              }
            ]}
          >
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.category}>
            {assignment.category} - {assignment.date.due.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <View style={styles.input_container}>
          <TextInput
            value={points.current}
            placeholder={'__'}
            keyboardType={'decimal-pad'}
            returnKeyType={'done'}
            autoComplete={'off'}
            style={[
              styles.mark,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.black,
                width: getWidth(assignment.points)
              }
            ]}
            onChangeText={(input) => {
              if (isNumber(input) || input === '') update(input, 'earned')
            }}
          />
          <Text style={styles.dash}> / </Text>
          <TextInput
            value={total.current}
            placeholder={'__'}
            keyboardType={'decimal-pad'}
            returnKeyType={'done'}
            autoComplete={'off'}
            style={[
              styles.mark,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.black,
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
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Full Name:</Text>
            <Text style={styles.dropdown_text_value}>{name}</Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Effective Weight:</Text>
            <Text style={styles.dropdown_text_value}>
              {roundTo(
                (marks.courses.get(course).categories.get(assignment.category)
                  .weight /
                  totalWeight) *
                  100,
                2
              )}
              %
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Grade:</Text>
            <Text style={styles.dropdown_text_value}>
              {hasScore
                ? `${roundTo(score, 2)}% (${calculateLetterGrade(score)})`
                : 'N/A'}
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Status:</Text>
            <Text style={styles.dropdown_text_value}>{assignment.status}</Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Due Date:</Text>
            <Text style={styles.dropdown_text_value}>
              {assignment.date.due.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Start Date:</Text>
            <Text style={styles.dropdown_text_value}>
              {assignment.date.start.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Notes:</Text>
            <Text style={styles.dropdown_text_value}>
              {assignment.notes.length === 0 ? 'None' : assignment.notes}
            </Text>
          </View>
          <FontAwesome.Button
            name="trash-o"
            backgroundColor="transparent"
            iconStyle={{
              color: Colors.red
            }}
            underlayColor="none"
            activeOpacity={0.5}
            size={24}
            onPress={() => setMarks(deleteAssignment(marks, course, name))}
          ></FontAwesome.Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.off_white,
    borderRadius: 10,
    marginHorizontal: 7,
    marginTop: 7,
    borderWidth: 1,
    borderTopColor: Colors.secondary,
    borderRightColor: Colors.secondary,
    borderBottomColor: Colors.secondary,
    borderLeftColor: Colors.secondary
  },
  horizontal_container: {
    flexDirection: 'row'
  },
  dropdown_container: {
    padding: 7,
    paddingTop: 0
  },
  assignment_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 3,
    flex: 1
  },
  name: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    marginHorizontal: 7,
    lineHeight: 14 * 0.75,
    textAlign: 'left',
    ...Platform.select({
      web: {
        paddingBottom: 11 - 11 * 0.75
      },
      default: {
        paddingTop: 14 - 14 * 0.75
      }
    })
  },
  category: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginHorizontal: 7,
    marginTop: 4,
    textAlign: 'left',
    ...Platform.select({
      web: {
        lineHeight: 11 * 0.75,
        paddingVertical: 2
      },
      default: {
        lineHeight: 12 * 0.75,
        paddingTop: 12 - 12 * 0.75
      }
    })
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7
  },
  mark: {
    height: 60,
    fontSize: 23,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'center',
    outlineStyle: 'none'
  },
  dash: {
    fontSize: 20,
    alignSelf: 'center',
    textAlignVertical: 'center',
    marginRight: 3
  },
  dropdown_text_name: {
    marginHorizontal: 7,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12
  },
  dropdown_text_value: {
    fontFamily: 'Inter_400Regular',
    flex: 1,
    fontSize: 12
  }
})

export default Assignment

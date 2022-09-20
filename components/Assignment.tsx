import React, { useContext, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Platform } from 'react-native'
import GradeUtil from '../gradebook/GradeUtil'
import AppContext from '../contexts/AppContext'
import { Colors } from '../colors/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome from '@expo/vector-icons/FontAwesome'

function AssignmentComponent(props) {
  const { marks, setMarks } = useContext(AppContext)
  const [isDropdown, setIsDropdown] = useState(false)
  const assignment = marks.courses
    .get(props.course)
    .assignments.find((a) => a.name === props.name)
  const totalWeight = Array.from(
    marks.courses.get(props.course).categories.values()
  ).reduce((p, c) => (isNaN(c.value) ? p : p + c.weight), 0)
  const [points, setPoints] = useState(
    isNaN(assignment.points) ? '' : assignment.points.toString()
  )
  const [total, setTotal] = useState(
    isNaN(assignment.total) ? '' : assignment.total.toString()
  )

  const updatePoints = (input: string, type: string) => {
    setMarks(
      GradeUtil.updatePoints(
        marks,
        props.course,
        assignment.name,
        parseFloat(input),
        type
      )
    )
  }

  const deleteAssignment = () => {
    setMarks(GradeUtil.deleteAssignment(marks, props.course, assignment.name))
  }

  const getWidth = (n: number) => {
    const min = 34
    if (isNaN(n)) return min
    return Math.max(n.toString().length * 15, min)
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.horizontal_container, { height: 52 }]}>
        <View style={styles.assignment_info_container}>
          <Text
            numberOfLines={1}
            style={[
              Platform.OS === 'web' ? styles.name_web : styles.name,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.navy
              }
            ]}
          >
            {props.name}
          </Text>
          <Text
            numberOfLines={1}
            style={
              Platform.OS === 'web' ? styles.category_web : styles.category
            }
          >
            {assignment.category} - {assignment.date.due.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.input_container}>
          <TextInput
            value={points}
            placeholder={'__'}
            keyboardType={'decimal-pad'}
            autoComplete={'off'}
            style={[
              styles.mark,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.black,
                width: getWidth(assignment.points),
                ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
              }
            ]}
            onChangeText={(input) => {
              if (GradeUtil.isNumber(input) || input === '') {
                setPoints(input)
                updatePoints(input, 'earned')
              }
            }}
          />
          <Text style={styles.dash}> / </Text>
          <TextInput
            value={total}
            placeholder={'__'}
            keyboardType={'decimal-pad'}
            autoComplete={'off'}
            style={[
              styles.mark,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.black,
                width: getWidth(assignment.total),
                ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
              }
            ]}
            onChangeText={(input) => {
              if (GradeUtil.isNumber(input) || input === '') {
                setTotal(input)
                updatePoints(input, 'total')
              }
            }}
          />
        </View>
        <TouchableOpacity onPress={() => setIsDropdown(!isDropdown)}>
          <MaterialIcons
            name={isDropdown ? 'arrow-drop-up' : 'arrow-drop-down'}
            color={Colors.middle_blue_green}
            size={36}
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
      </View>
      {isDropdown && (
        <View style={styles.dropdown_container}>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Name:</Text>
            <Text style={styles.dropdown_text_value}>{assignment.name}</Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Category:</Text>
            <Text style={styles.dropdown_text_value}>
              {assignment.category}
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Effective Weight:</Text>
            <Text style={styles.dropdown_text_value}>
              {GradeUtil.roundTo(
                (marks.courses
                  .get(props.course)
                  .categories.get(assignment.category).weight /
                  totalWeight) *
                  100,
                2
              )}
              %
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Weight:</Text>
            <Text style={styles.dropdown_text_value}>
              {
                marks.courses
                  .get(props.course)
                  .categories.get(assignment.category).weight
              }
              %
            </Text>
          </View>
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Grade:</Text>
            <Text style={styles.dropdown_text_value}>
              {isNaN(assignment.points / assignment.total)
                ? 'N/A'
                : `${GradeUtil.roundTo(
                    (assignment.points / assignment.total) * 100,
                    2
                  )} (${GradeUtil.calculateLetterGrade(
                    (assignment.points / assignment.total) * 100
                  )})`}
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
          <View style={styles.horizontal_container}>
            <Text style={styles.dropdown_text_name}>Modified By You:</Text>
            <Text style={styles.dropdown_text_value}>
              {assignment.modified ? 'True' : 'False'}
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
            onPress={() => deleteAssignment()}
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
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.secondary
  },
  horizontal_container: {
    flexDirection: 'row'
  },
  dropdown_container: {
    padding: 10,
    backgroundColor: Colors.off_white,
    borderTopColor: Colors.onyx_gray,
    borderTopWidth: 1
  },
  assignment_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 7,
    flex: 1
  },
  name_web: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    marginHorizontal: 7,
    lineHeight: 14 * 0.75,
    paddingBottom: 11 - 11 * 0.75,
    textAlign: 'left'
  },
  category_web: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginHorizontal: 7,
    lineHeight: 11 * 0.75,
    paddingVertical: 2,
    marginTop: 4,
    textAlign: 'left'
  },
  name: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    marginHorizontal: 7,
    lineHeight: 14 * 0.75,
    paddingTop: 14 - 14 * 0.75,
    textAlign: 'left'
  },
  category: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginHorizontal: 7,
    lineHeight: 11 * 0.75,
    marginTop: 4,
    paddingTop: 11 - 11 * 0.75,
    textAlign: 'left'
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mark: {
    height: 60,
    fontSize: 23,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'center'
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

export default AssignmentComponent

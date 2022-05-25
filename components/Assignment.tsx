import React, { useContext, useState } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import GradeUtil from '../gradebook/GradeUtil'
import AppContext from '../contexts/AppContext'
import { Colors } from '../colors/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

function AssignmentComponent(props) {
  const { marks, setMarks } = useContext(AppContext)
  const [isDropdown, setIsDropdown] = useState(false)
  const assignment = marks.courses
    .get(props.course)
    .assignments.find((a) => a.name === props.name)

  const updatePoints = (input: string, type: string) => {
    setMarks(
      GradeUtil.updatePoints(marks, props.course, assignment.name, input, type)
    )
  }

  const deleteAssignment = () => {
    setMarks(GradeUtil.deleteAssignment(marks, props.course, assignment.name))
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.horizontal_container, { height: 52 }]}>
        <View style={styles.assignment_info_container}>
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
            {props.name}
          </Text>
          <Text numberOfLines={1} style={styles.category}>
            {assignment.category} - {assignment.date.due.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.input_container}>
          <TextInput
            defaultValue={
              isNaN(assignment.points) ? '' : assignment.points.toString()
            }
            placeholder={'__'}
            style={[
              styles.mark,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.black,
                width: Math.max(
                  assignment.points?.toString().replace(/[^0-9]/g, '').length *
                    20,
                  40
                )
              }
            ]}
            onChangeText={(input) => updatePoints(input, 'earned')}
          />
          <Text style={styles.dash}> / </Text>
          <TextInput
            defaultValue={
              isNaN(assignment.total) ? '' : assignment.total.toString()
            }
            placeholder={'__'}
            style={[
              styles.mark,
              {
                color: assignment.modified
                  ? Colors.dark_middle_blue_green
                  : Colors.black,
                width: Math.max(
                  assignment.total?.toString().replace(/[^0-9]/g, '').length *
                    20,
                  20
                )
              }
            ]}
            onChangeText={(input) => updatePoints(input, 'total')}
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
            <Text style={styles.dropdown_text_name}>Grade:</Text>
            <Text style={styles.dropdown_text_value}>
              {GradeUtil.roundToTwo(
                (assignment.points / assignment.total) * 100
              )}{' '}
              (
              {GradeUtil.calculateLetterGrade(
                (assignment.points / assignment.total) * 100
              )}
              )
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
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 2
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
    fontSize: 11,
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
    borderWidth: 0,
    fontSize: 23,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'center'
  },
  dash: {
    fontSize: 20,
    alignSelf: 'center',
    textAlignVertical: 'center',
    marginRight: 8,
    marginLeft: 0
  },
  dropdown_text_name: {
    marginHorizontal: 7,
    fontFamily: 'Montserrat_600SemiBold'
  },
  dropdown_text_value: {
    fontFamily: 'Inter_400Regular',
    flex: 1
  }
})

export default AssignmentComponent

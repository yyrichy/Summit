import React, { useContext } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import GradeUtil from '../gradebook/GradeUtil'
import { LightTheme } from '../theme/LightTheme'
import AppContext from './AppContext'

function AssignmentComponent(props) {
  const { marks, setMarks } = useContext(AppContext)
  const assignment = marks.courses
    .get(props.course)
    .categories.get(props.category)
    .assignments.get(props.name)

  const updatePoints = (input: string, type: string) => {
    const points = parseFloat(input)
    let newMarks = Object.assign({}, marks)
    if (type === 'earned') {
      newMarks.courses
        .get(props.course)
        .categories.get(props.category)
        .assignments.get(props.name).points = points
    } else if (type === 'total') {
      newMarks.courses
        .get(props.course)
        .categories.get(props.category)
        .assignments.get(props.name).total = points
    }
    newMarks.courses
      .get(props.course)
      .categories.get(props.category)
      .assignments.get(props.name).modified = true
    newMarks = GradeUtil.calculatePoints(newMarks)
    setMarks(newMarks)
  }

  return (
    <View style={[styles.container, props.style]}>
      <Text
        numberOfLines={2}
        style={[
          styles.name,
          {
            color: assignment.modified ? LightTheme.colors.dark_red : 'black'
          }
        ]}
      >
        {props.name}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          defaultValue={
            isNaN(assignment.points) ? '' : assignment.points.toString()
          }
          placeholder={'_'}
          style={[
            styles.mark,
            {
              color: assignment.modified ? LightTheme.colors.dark_red : 'black'
            }
          ]}
          onChangeText={(input) => updatePoints(input, 'earned')}
        />
        <Text style={styles.dash}> / </Text>
        <TextInput
          defaultValue={
            isNaN(assignment.total) ? '' : assignment.total.toString()
          }
          placeholder={'_'}
          style={[
            styles.mark,
            {
              marginRight: 10,
              color: assignment.modified ? LightTheme.colors.dark_red : 'black'
            }
          ]}
          onChangeText={(input) => updatePoints(input, 'total')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: LightTheme.colors.card_background,
    borderRadius: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'left',
    flex: 1
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
    textAlignVertical: 'center'
  }
})

export default AssignmentComponent

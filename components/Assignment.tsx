import React, { useContext, useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import { StyleSheet, View, Text } from 'react-native'
import GradebookContext from '../interfaces/Gradebook'

function AssignmentComponent(props) {
  const { gradebook, setGradebook } = useContext(GradebookContext)
  let p = NaN
  let pT = NaN
  if (props.value != 'Not Graded' && props.value != 'Not Due') {
    const points = props.points.split('/').map((p) => p.replace(/\s+/g, ''))
    p = parseFloat(points[0])
    pT = parseFloat(points[1])
  } else {
    pT = parseFloat(props.points.substring(0, props.points.indexOf(' ')))
  }

  const [pointsEarned, setPointsEarned] = useState(p)
  const [pointsTotal, setPointsTotal] = useState(pT)

  const updatePointsEarned = (input: string) => {
    const points = parseFloat(input)
    setPointsEarned(points)
  }

  const updatePointsTotal = (input: string) => {
    const points = parseFloat(input)
    setPointsTotal(points)
  }

  useEffect(() => {
    const gb = gradebook
    const i = gb.courses.findIndex((c) => c.title === props.course)
    const course = gb.courses[i]
    const index = course.marks[0].assignments.findIndex(
      (a) => a.name === props.name
    )
    const assignment = course.marks[0].assignments[index]
    console.log(course.title)
    console.log(course.marks)
    assignment.points = `${pointsEarned} / ${pointsTotal}`
    gb.courses[i].marks[0].assignments[index] = assignment
    setGradebook(gb)
  }, [pointsEarned, pointsTotal])

  return (
    <View style={[styles.container, props.style]}>
      <Text numberOfLines={2} style={styles.name}>
        {props.name}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          defaultValue={pointsEarned?.toString()}
          placeholder={'Points'}
          style={styles.mark}
          onChangeText={(input) => updatePointsEarned(input)}
        />
        <Text style={styles.dash}> / </Text>
        <TextInput
          defaultValue={pointsTotal?.toString()}
          placeholder={'Total'}
          style={[styles.mark, { marginRight: 10 }]}
          onChangeText={(input) => updatePointsTotal(input)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(221,221,221)',
    borderRadius: 10,
    height: 30,
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
    color: '#121212',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'left',
    flex: 1
  },
  mark: {
    height: 60,
    borderWidth: 0,
    fontSize: 20,
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

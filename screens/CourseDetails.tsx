import React, { useContext } from 'react'
import { FlatList, View } from 'react-native'
import AssignmentComponent from '../components/Assignment'
import GradebookContext from '../interfaces/Gradebook'

const CourseDetails = ({ route }) => {
  const context = useContext(GradebookContext)
  const course = context.gradebook.courses.find(
    (c) => c.title === route.params.title
  )
  const assignments = course.marks[0].assignments.map((a) => {
    return {
      name: a.name,
      points: a.points,
      value: a.score.value,
      course: course.title
    }
  })

  return (
    <View>
      <FlatList
        data={assignments}
        renderItem={({ item }) => (
          <AssignmentComponent
            name={item.name}
            points={item.points}
            value={item.value}
            course={item.course}
          ></AssignmentComponent>
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  )
}

export default CourseDetails

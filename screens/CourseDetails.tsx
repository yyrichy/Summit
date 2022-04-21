import React, { useContext } from 'react'
import { FlatList, View } from 'react-native'
import Assignment from '../components/Assignment'
import GradebookContext from '../components/Gradebook'

const CourseDetails = ({ route }) => {
  const context = useContext(GradebookContext)
  const course = context.gradebook.courses.find(
    (c) => c.title === route.params.title
  )
  const assignments = course.marks[0].assignments

  return (
    <View>
      <FlatList
        data={assignments}
        renderItem={({ item }) => (
          <Assignment name={item.name} mark={item.points}></Assignment>
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  )
}

export default CourseDetails

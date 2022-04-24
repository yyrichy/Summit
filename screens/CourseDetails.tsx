import React, { useContext } from 'react'
import { FlatList, View } from 'react-native'
import AppContext from '../components/AppContext'
import AssignmentComponent from '../components/Assignment'

const CourseDetails = ({ route }) => {
  const { marks } = useContext(AppContext)
  const course = marks.courses.get(route.params.title)
  const data = []
  for (const [categoryName, category] of course.categories.entries()) {
    for (const [assignmentName] of category.assignments.entries()) {
      data.push({
        name: assignmentName,
        course: route.params.title,
        category: categoryName
      })
    }
  }

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <AssignmentComponent
            name={item.name}
            course={item.course}
            category={item.category}
          ></AssignmentComponent>
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  )
}

export default CourseDetails

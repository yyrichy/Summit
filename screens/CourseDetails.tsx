import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { FlatList, View } from 'react-native'
import AppContext from '../contexts/AppContext'
import AssignmentComponent from '../components/Assignment'
import GradeUtil from '../gradebook/GradeUtil'

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()

  const { marks } = useContext(AppContext)
  const course = marks.courses.get(courseName)
  const data = []
  for (const [categoryName, category] of course.categories.entries()) {
    for (const [assignmentName] of category.assignments.entries()) {
      data.push({
        name: assignmentName,
        course: courseName,
        category: categoryName
      })
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${course.points} | ${GradeUtil.parseCourseName(courseName)}`
    })
  })

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

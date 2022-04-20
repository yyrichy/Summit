import React from 'react'
import { useContext } from 'react'
import { View } from 'react-native'
import AppContext from '../components/AppContext'
import CourseComponent from '../components/Course'

const CourseDetails = ({ route }) => {
  const context = useContext(AppContext)
  const course = context.gradebook.courses.find(
    (c) => c.title === route.params.title
  )

  return (
    <View>
    </View>
  )
}

export default CourseDetails

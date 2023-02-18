import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CourseDetails from './CourseDetails'
import Courses from './Courses'

const Stack = createNativeStackNavigator()

const Grades = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Courses"
        component={Courses}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Course Details"
        component={CourseDetails}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default Grades

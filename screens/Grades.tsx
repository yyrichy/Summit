import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CourseDetails from './CourseDetails'
import Courses from './Courses'
import GradeContext from '../contexts/GradeContext'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  const [course, setCourse] = useState(undefined as string)

  return (
    <GradeContext.Provider
      value={{ courseHeader: course, setCourse: setCourse }}
    >
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
    </GradeContext.Provider>
  )
}

export default StackNavigator

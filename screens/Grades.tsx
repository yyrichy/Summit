import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CourseDetails from './CourseDetails'
import Courses from './Courses'
import GradeContext from '../contexts/GradeContext'

const Stack = createStackNavigator()

const StackNavigator = () => {
  const [course, setCourse] = useState(undefined)

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
        <Stack.Screen name="Course Details" component={CourseDetails} />
      </Stack.Navigator>
    </GradeContext.Provider>
  )
}

export default StackNavigator

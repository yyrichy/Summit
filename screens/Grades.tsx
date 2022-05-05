import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CourseDetails from './CourseDetails'
import Courses from './Courses'
import GradeContext from '../contexts/GradeContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const Stack = createStackNavigator()

const StackNavigator = () => {
  const [course, setCourse] = useState(undefined)

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
    </SafeAreaView>
  )
}

export default StackNavigator

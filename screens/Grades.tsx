import React, { useState, useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CourseDetails from './CourseDetails'
import Courses from './Courses'

const Stack = createStackNavigator()

const StackNavigator = () => {
  return (
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
  )
}

export default StackNavigator

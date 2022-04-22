import React, { useState, useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CourseDetails from './CourseDetails'
import Courses from './Courses'
import GradebookContext from '../interfaces/Gradebook'
import AppContext from '../components/AppContext'
import { Assignment } from 'studentvue'

const Stack = createStackNavigator()

const StackNavigator = () => {
  const context = useContext(AppContext)
  const [gradebook, setGradebook] = useState(context.gradebook)

  return (
    <GradebookContext.Provider
      value={{
        gradebook: gradebook,
        setGradebook
      }}
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
    </GradebookContext.Provider>
  )
}

export default StackNavigator

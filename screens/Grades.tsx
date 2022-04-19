import React, { useContext, useRef } from "react"
import AppContext from "../components/AppContext"
import { View } from "react-native"
import { useState } from "react"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import CourseComponent from "../components/Course"

const Grades = () => {
  const componentMounted = useRef(true)
  const context = useContext(AppContext)
  const gradebook = context.gradebook
  const [courses, setCourses] = useState( 
    gradebook.courses
  )

  return (
    <View>
      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <CourseComponent name={item.title} mark={item.marks[0].calculatedScore.string}></CourseComponent>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.title}
      />
    </View>
  )
}

export default Grades

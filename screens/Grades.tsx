import React, { useContext, useEffect, useRef } from "react"
import AppContext from "../components/AppContext"
import { View, Text } from "react-native"
import { useState } from "react"
import { Gradebook } from "studentvue/StudentVue/Client/Interfaces/Gradebook"

const Grades = () => {
  const [gradebook, setGradebook] = useState(undefined as Gradebook)
  const componentMounted = useRef(true)
  const context = useContext(AppContext)

  useEffect(() => {
    const grades = async () => {
      const grades = await context.client.gradebook()
      if (componentMounted.current) {
        setGradebook(grades)
      }
      return () => {
        componentMounted.current = false
      }
    }
    grades()
  }, [])

  return (
    <View>
      <Text>
        {gradebook == undefined
          ? ""
          : gradebook.courses.map(
              (c) => `${c.title} - ${c.marks[0].calculatedScore.raw}\n`
            )}
      </Text>
    </View>
  )
}

export default Grades

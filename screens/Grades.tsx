import React, { useContext } from "react"
import AppContext from "../components/AppContext"
import { View, Text } from "react-native"
import { useState } from "react"
import { Gradebook } from "studentvue/StudentVue/Client/Interfaces/Gradebook"

const Grades = () => {
  const [gradebook, setGradebook] = useState(undefined as Gradebook)

  const context = useContext(AppContext)
  context.client.gradebook().then(res => setGradebook(res))
  
  return (
    <View>
      <Text>{gradebook == undefined ? "" : gradebook.courses.map(c => `${c.title} - ${c.marks[0].calculatedScore.raw}\n`)}</Text>
    </View>
  )
}

export default Grades

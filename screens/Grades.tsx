import React, { useContext, useEffect, useRef } from "react"
import AppContext from "../components/AppContext"
import { View, Text, Alert } from "react-native"
import { useState } from "react"
import { Gradebook } from "studentvue/StudentVue/Client/Interfaces/Gradebook"

const Grades = () => {
  const componentMounted = useRef(true)
  const context = useContext(AppContext)
	const gradebook = context.gradebook;

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

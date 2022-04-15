import React, { useContext } from "react"
import AppContext from "../components/AppContext"
import { View, Text } from "react-native"

const Grades = () => {
  const context = useContext(AppContext)

  return (
    <View>
      <Text>This is the grades screen {context.username}</Text>
    </View>
  )
}

export default Grades

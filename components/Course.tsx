import React from "react"
import { StyleSheet, View, Text } from "react-native"

function CourseComponent(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.name}>{props.name}</Text>
      <Text style={styles.mark}>{props.mark}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(221,221,221)",
    borderRadius: 15,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7
  },
  name: {
    color: "#121212",
    fontSize: 18,
    marginLeft: 20
  },
  mark: {
    color: "#121212",
    fontSize: 35,
    alignSelf: "center",
    marginRight: 20
  }
})

export default CourseComponent

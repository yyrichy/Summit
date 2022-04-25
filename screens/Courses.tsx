import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../components/AppContext'
import { StyleSheet, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import CourseComponent from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import Grades from '../gradebook/Grades'
import GradeUtil from '../gradebook/GradeUtil'

const Courses = ({ navigation }) => {
  const context = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(
    context.gradebook.reportingPeriod.current.index
  )
  const [periods, setPeriods] = useState(
    context.gradebook.reportingPeriod.available.map((p) => {
      return { label: p.name, value: p.index }
    })
  )
  const { marks, setMarks, setGradebook } = useContext(AppContext)

  useEffect(() => {
    let isSubscribed = true
    const getGradebook = async () => {
      const gradebook = await context.client.gradebook(value)
      const marks = await GradeUtil.convertGradebook(gradebook)
      if (isSubscribed) {
        setGradebook(gradebook)
        setMarks(marks)
      }
    }
    getGradebook()
    return () => {
      isSubscribed = false
    }
  }, [value])

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={periods}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setPeriods}
        maxHeight={null}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
      ></DropDownPicker>
      {marks != null && (
        <FlatList
          data={Array.from(marks.courses.entries())}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Course Details', { title: item[0] })
              }
            >
              <CourseComponent
                name={GradeUtil.parseCourseName(item[0])}
                mark={item[1].points}
              ></CourseComponent>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item[0]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 7
  },
  dropdownText: {
    fontFamily: 'Inter_800ExtraBold'
  }
})

export default Courses

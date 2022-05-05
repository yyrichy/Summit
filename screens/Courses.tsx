import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/AppContext'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import CourseComponent from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
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
    <SafeAreaView style={{ flex: 1 }}>
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
          data={[...marks.courses.entries()]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Course Details', { title: item[0] })
              }
            >
              <CourseComponent
                name={GradeUtil.parseCourseName(item[0])}
                mark={item[1].points}
                period={item[1].period}
                teacher={item[1].teacher}
              ></CourseComponent>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item[0]}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 0,
    height: 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 21,
    backgroundColor: 'transparent'
  },
  dropdownText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30
  }
})

export default Courses

import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../components/AppContext'
import { StyleSheet, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import CourseComponent from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import GradebookContext from '../interfaces/Gradebook'

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
  const { gradebook, setGradebook } = useContext(GradebookContext)

  useEffect(() => {
    let isSubscribed = true
    const getGradebook = async () => {
      const gradebook = await context.client.gradebook(value)
      if (isSubscribed) {
        setGradebook(gradebook)
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
      {gradebook != null && (
        <FlatList
          data={gradebook.courses}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Course Details', { title: item.title })
              }
            >
              <CourseComponent
                name={item.title}
                mark={item.marks[0].calculatedScore.raw}
              ></CourseComponent>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.title}
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

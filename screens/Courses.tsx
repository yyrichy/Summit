import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../components/AppContext'
import { View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import CourseComponent from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import GradebookContext from '../components/Gradebook'

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

export default Courses

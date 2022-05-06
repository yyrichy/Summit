import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/AppContext'
import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import CourseComponent from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import GradeUtil from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { showMessage } from 'react-native-flash-message'
import { Colors } from '../colors/Colors'

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

  const refreshMarks = async () => {
    const newGradebook = await context.client.gradebook(value)
    const newMarks = await GradeUtil.convertGradebook(newGradebook)
    setGradebook(newGradebook)
    setMarks(newMarks)
    showMessage({
      message: 'Refreshed',
      type: 'info',
      icon: 'success'
    })
  }

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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <Text
            style={{
              marginLeft: 11,
              fontFamily: 'Montserrat_700Bold',
              fontSize: 22
            }}
          >
            {marks.gpa} GPA
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <FontAwesome.Button
            name="refresh"
            backgroundColor="transparent"
            iconStyle={{
              color: Colors.secondary
            }}
            size={24}
            onPress={() => refreshMarks()}
          ></FontAwesome.Button>
        </View>
      </View>
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
                mark={item[1].value}
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
    marginBottom: 15,
    backgroundColor: 'transparent'
  },
  dropdownText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30
  }
})

export default Courses

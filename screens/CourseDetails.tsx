import { useNavigation } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import AppContext from '../contexts/AppContext'
import AssignmentComponent from '../components/Assignment'
import GradeUtil from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { LightTheme } from '../theme/LightTheme'
import Modal from 'react-native-modal'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import DropDownPicker from 'react-native-dropdown-picker'
import CustomButton from '../components/CustomButton'
import { Assignment } from '../interfaces/Gradebook'
import { Colors } from '../colors/Colors'
import { showMessage } from 'react-native-flash-message'
import { SafeAreaView } from 'react-native-safe-area-context'

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()

  const { marks, gradebook, client, setMarks, setGradebook } =
    useContext(AppContext)
  const course = marks.courses.get(courseName)
  const data = []
  for (const assignment of course.assignments) {
    data.push({
      name: assignment.name,
      course: courseName
    })
  }

  const [isModalVisible, setModalVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(
    gradebook.courses
      .find((c) => c.title === courseName)
      .marks[0].weightedCategories.map((c) => c.type)[0]
  )
  const [categories, setCategories] = useState(
    gradebook.courses
      .find((c) => c.title === courseName)
      .marks[0].weightedCategories.map((c) => {
        return { label: c.type, value: c.type }
      })
  )
  let assignmentName: string = ''
  let points: number = 0
  let total: number = 0

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const addAssignment = () => {
    course.assignments.push({
      name: assignmentName,
      category: category,
      status: 'Graded',
      points: points,
      total: total,
      modified: true
    })
    marks.courses.set(courseName, course)
    let m = Object.assign({}, marks)
    m = GradeUtil.calculatePoints(m)
    setMarks(m)
    toggleModal()
  }

  const refreshMarks = async () => {
    const newGradebook = await client.gradebook(
      gradebook.reportingPeriod.current.index
    )
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
    <SafeAreaView>
      <View style={styles.course_details_container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <FontAwesome.Button
            name="chevron-left"
            backgroundColor="transparent"
            iconStyle={{
              color: Colors.secondary
            }}
            size={24}
            onPress={() => navigation.goBack()}
          ></FontAwesome.Button>
        </View>
        <Text numberOfLines={1} style={styles.course_details}>
          {course.value} | {GradeUtil.parseCourseName(courseName)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end'
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
      <FlatList
        data={data}
        ListFooterComponent={
          <FontAwesome.Button
            name="plus-circle"
            backgroundColor="transparent"
            iconStyle={{
              color: Colors.secondary
            }}
            style={{
              flexDirection: 'row-reverse'
            }}
            size={24}
            onPress={toggleModal}
          ></FontAwesome.Button>
        }
        renderItem={({ item }) => (
          <AssignmentComponent
            name={item.name}
            course={item.course}
          ></AssignmentComponent>
        )}
        keyExtractor={(item) => item.name}
      />
      <Modal
        isVisible={isModalVisible}
        coverScreen={true}
        onBackdropPress={toggleModal}
      >
        <View style={styles.modal}>
          <View style={styles.modal_view}>
            <Text style={styles.modal_title}>New Assignment</Text>
            <TextInput
              placeholder="Name"
              onChangeText={(t) => {
                assignmentName = t
              }}
              style={styles.input}
            ></TextInput>
            <TextInput
              placeholder="Points Earned"
              onChangeText={(t) => (points = parseFloat(t))}
              style={styles.input}
            ></TextInput>
            <TextInput
              placeholder="Total Points"
              onChangeText={(t) => (total = parseFloat(t))}
              style={styles.input}
            ></TextInput>
            <View
              style={{
                marginHorizontal: 7,
                marginTop: 7
              }}
            >
              <DropDownPicker
                open={open}
                value={category}
                items={categories}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setCategories}
                maxHeight={null}
                style={styles.dropdown}
              ></DropDownPicker>
              <CustomButton
                onPress={addAssignment}
                text={'Add Assignment'}
                backgroundColor={LightTheme.colors.card}
                textColor={Colors.black}
                fontFamily="Inter_600SemiBold"
                containerStyle={styles.button_container}
              ></CustomButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    margin: 7,
    padding: 5,
    borderWidth: 1,
    height: 30,
    borderColor: 'black'
  },
  modal_title: {
    alignSelf: 'center',
    marginBottom: 7,
    marginTop: 14,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 330,
    height: 300
  },
  modal_view: {
    width: 330,
    height: 300
  },
  dropdown: {
    height: 30,
    borderRadius: 0,
    alignItems: 'center',
    alignSelf: 'center'
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 200,
    height: 50,
    borderRadius: 10,
    borderWidth: 0,
    marginTop: 30
  },
  course_details: {
    fontSize: 22,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'Inter_800ExtraBold'
  },
  course_details_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default CourseDetails

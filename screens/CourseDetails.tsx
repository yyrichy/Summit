import { useNavigation } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import AppContext from '../contexts/AppContext'
import AssignmentComponent from '../components/Assignment'
import GradeUtil from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { LightTheme } from '../theme/LightTheme'
import Modal from 'react-native-modal'
import { TextInput } from 'react-native-gesture-handler'
import DropDownPicker from 'react-native-dropdown-picker'
import CustomButton from '../components/CustomButton'
import { Assignment } from '../interfaces/Gradebook'

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()

  const { marks, gradebook, setMarks } = useContext(AppContext)
  const course = marks.courses.get(courseName)
  const data = []
  for (const [categoryName, category] of course.categories.entries()) {
    for (const [assignmentName] of category.assignments.entries()) {
      data.push({
        name: assignmentName,
        course: courseName,
        category: categoryName
      })
    }
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${course.points} | ${GradeUtil.parseCourseName(courseName)}`
    })
  })

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const addAssignment = () => {
    if (!course.categories.has(category)) {
      course.categories.set(category, {
        assignments: new Map<string, Assignment>()
      })
    }
    course.categories.get(category).assignments.set(assignmentName, {
      name: assignmentName,
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

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <AssignmentComponent
            name={item.name}
            course={item.course}
            category={item.category}
          ></AssignmentComponent>
        )}
        keyExtractor={(item) => item.name}
      />
      <FontAwesome.Button
        name="plus-circle"
        backgroundColor={LightTheme.colors.background}
        color="black"
        iconStyle={{
          color: LightTheme.colors.primary
        }}
        style={{
          flexDirection: 'row-reverse'
        }}
        size={32}
        onPress={toggleModal}
      ></FontAwesome.Button>
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
                textColor="black"
                fontFamily="Inter_600SemiBold"
                containerStyle={styles.button_container}
              ></CustomButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backfaceVisibility: 'visible',
    backgroundColor: 'white',
    borderRadius: 10
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
  }
})

export default CourseDetails

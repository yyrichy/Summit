import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import AppContext from '../contexts/AppContext'
import AssignmentComponent from '../components/Assignment'
import GradeUtil from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { LightTheme } from '../theme/LightTheme'
import Modal from 'react-native-modal'
import { TextInput } from 'react-native-gesture-handler'
import DropDownPicker from 'react-native-dropdown-picker'
import CustomButton from '../components/CustomButton'
import { Colors } from '../colors/Colors'
import { showMessage } from 'react-native-flash-message'
import { SafeAreaView } from 'react-native-safe-area-context'
import AwesomeAlert from 'react-native-awesome-alerts'

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(courseName)

  const [isModalVisible, setModalVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(
    marks.courses.get(courseName).categories.values().next().value.name
  )
  const [categories, setCategories] = useState(
    Array.from(marks.courses.get(courseName).categories.values()).map((c) => {
      return { label: c.name, value: c.name }
    })
  )
  const [assignmentName, setAssignmentName] = useState('')
  const [points, setPoints] = useState(NaN)
  const [total, setTotal] = useState(NaN)

  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    if (isModalVisible) {
      setAssignmentName('')
      setPoints(NaN)
      setTotal(NaN)
    }
  }, [isModalVisible])

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const addAssignment = () => {
    setMarks(
      GradeUtil.addAssignment(
        marks,
        course,
        assignmentName,
        category,
        points,
        total
      )
    )
    toggleModal()
  }

  const refreshMarks = async () => {
    setIsLoading(true)
    try {
      setMarks(
        await GradeUtil.convertGradebook(
          await client.gradebook(marks.reportingPeriod.index)
        )
      )
      showMessage({
        message: 'Refreshed',
        type: 'info',
        icon: 'success'
      })
    } catch (err) {
      setErrorMessage(err.message)
      setShowAlert(true)
    }
    setIsLoading(false)
  }

  return (
    <>
      <SafeAreaView
        style={{ flex: 1 }}
        pointerEvents={isLoading ? 'none' : 'auto'}
      >
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
              underlayColor="none"
              activeOpacity={0.5}
              size={24}
              onPress={() => navigation.goBack()}
            ></FontAwesome.Button>
          </View>
          <Text numberOfLines={1} style={styles.course_details}>
            {isNaN(course.value) ? 'N/A' : course.value} |{' '}
            {GradeUtil.parseCourseName(courseName)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <FontAwesome.Button
              name="plus-circle"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.secondary
              }}
              size={24}
              underlayColor="none"
              activeOpacity={0.5}
              onPress={() => toggleModal()}
            ></FontAwesome.Button>
            <FontAwesome.Button
              name="refresh"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.secondary
              }}
              underlayColor="none"
              activeOpacity={0.5}
              size={24}
              onPress={() => refreshMarks()}
            ></FontAwesome.Button>
          </View>
        </View>
        <FlatList
          data={course.assignments}
          renderItem={({ item }) => (
            <AssignmentComponent
              name={item.name}
              course={courseName}
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
                value={assignmentName}
                placeholder="Name"
                onChangeText={(t) => {
                  setAssignmentName(t)
                }}
                style={styles.input}
              ></TextInput>
              <TextInput
                defaultValue={isNaN(points) ? '' : points.toString()}
                keyboardType="numeric"
                placeholder="Points Earned"
                onChangeText={(t) => setPoints(parseFloat(t))}
                style={styles.input}
              ></TextInput>
              <TextInput
                defaultValue={isNaN(total) ? '' : total.toString()}
                keyboardType="numeric"
                placeholder="Total Points"
                onChangeText={(t) => setTotal(parseFloat(t))}
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
      {isLoading && (
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator size={'large'} />
        </SafeAreaView>
      )}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={'Error'}
        message={errorMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText={'Ok'}
        confirmButtonColor={Colors.primary}
        confirmButtonTextStyle={{ color: Colors.black }}
        onConfirmPressed={() => {
          setShowAlert(false)
        }}
      ></AwesomeAlert>
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    margin: 7,
    padding: 5,
    borderWidth: 1,
    height: 30,
    borderColor: Colors.black
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
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.2)'
  }
})

export default CourseDetails

import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import AppContext from '../contexts/AppContext'
import Assignment from '../components/Assignment'
import {
  addAssignment,
  convertGradebook,
  parseCourseName,
  isNumber
} from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { LightTheme } from '../theme/LightTheme'
import Modal from 'react-native-modal'
import DropDownPicker from 'react-native-dropdown-picker'
import CustomButton from '../components/CustomButton'
import { Colors } from '../colors/Colors'
import { showMessage } from 'react-native-flash-message'
import { SafeAreaView } from 'react-native-safe-area-context'
import AwesomeAlert from 'react-native-awesome-alerts'
import Animated, {
  Layout,
  Transition,
  Transitioning
} from 'react-native-reanimated'

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(courseName)

  const refInput = useRef<TextInput | null>(null)
  const refInput2 = useRef<TextInput | null>(null)

  const [isModalVisible, setModalVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(
    marks.courses.get(courseName).categories.values().next().value?.name
  )
  const [categories, setCategories] = useState(
    Array.from(marks.courses.get(courseName).categories.values()).map((c) => {
      return { label: c.name, value: c.name }
    })
  )
  const [assignmentName, setAssignmentName] = useState('')
  const [points, setPoints] = useState('')
  const [total, setTotal] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  const ref = useRef(null)

  useEffect(() => {
    if (isModalVisible) {
      setAssignmentName('')
      setPoints('')
      setTotal('')
    }
  }, [isModalVisible])

  const toggleModal = (): void => {
    setModalVisible(!isModalVisible)
  }

  const add = () => {
    setMarks(
      addAssignment(
        marks,
        course,
        assignmentName,
        category,
        parseFloat(points),
        parseFloat(total)
      )
    )
    toggleModal()
  }

  const refreshMarks = async (): Promise<void> => {
    setIsLoading(true)
    try {
      setMarks(
        await convertGradebook(
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

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={500} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={500} />
    </Transition.Together>
  )

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
            {parseCourseName(courseName)}
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
        <Transitioning.View ref={ref} transition={transition}>
          <Animated.FlatList
            data={course.assignments}
            renderItem={({ item }) => (
              <Assignment
                name={item.name}
                course={courseName}
                onPress={() => ref.current.animateNextTransition()}
              ></Assignment>
            )}
            keyExtractor={(item) => item.name}
            //@ts-ignore
            itemLayoutAnimation={Layout.springify()}
          />
        </Transitioning.View>
        <Modal
          isVisible={isModalVisible}
          coverScreen={false}
          onBackdropPress={toggleModal}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
        >
          <View style={styles.modal}>
            <View style={styles.modal_view}>
              <TextInput
                returnKeyType={'next'}
                value={assignmentName}
                placeholder="Name (Optional)"
                onChangeText={(t) => {
                  setAssignmentName(t)
                }}
                style={[styles.input, { marginTop: 10 }]}
                blurOnSubmit={false}
                onSubmitEditing={() => refInput.current.focus()}
              />
              <TextInput
                returnKeyType={'next'}
                value={points}
                keyboardType="decimal-pad"
                autoComplete="off"
                placeholder="Points Earned"
                onChangeText={(t) => {
                  if (isNumber(t) || t === '') setPoints(t)
                }}
                style={styles.input}
                blurOnSubmit={false}
                ref={refInput}
                onSubmitEditing={() => refInput2.current.focus()}
              />
              <TextInput
                returnKeyType={'next'}
                value={total}
                keyboardType="decimal-pad"
                autoComplete="off"
                placeholder="Total Points"
                onChangeText={(t) => {
                  if (isNumber(t) || t === '') setTotal(t)
                }}
                style={styles.input}
                ref={refInput2}
                onSubmitEditing={() => setOpen(true)}
              />
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
                  textStyle={styles.dropdown_text}
                  containerStyle={styles.dropdown_container}
                  translation={{
                    PLACEHOLDER: 'Select Category'
                  }}
                  renderListItem={(props) => {
                    return (
                      <TouchableOpacity
                        {...props}
                        style={[
                          props.listItemContainerStyle,
                          {
                            backgroundColor:
                              props.isSelected && Colors.light_gray
                          }
                        ]}
                        onPress={() => {
                          setCategory(props.value)
                          setOpen(false)
                        }}
                        activeOpacity={0.5}
                      >
                        <View style={styles.category_name_container}>
                          <Text
                            numberOfLines={1}
                            style={props.listItemLabelStyle}
                          >
                            {props.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                ></DropDownPicker>
                <CustomButton
                  onPress={add}
                  text={'Add Assignment'}
                  backgroundColor={LightTheme.colors.card}
                  textColor={Colors.black}
                  fontFamily="Inter_600SemiBold"
                  containerStyle={styles.button_container}
                  disabled={false}
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
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    height: 30,
    borderColor: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    borderRadius: 5
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 330,
    height: 250
  },
  modal_view: {
    width: 330,
    height: 250
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 200,
    height: 50,
    borderRadius: 10,
    borderWidth: 0,
    margin: 10
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
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: 'transparent',
    padding: 5,
    marginHorizontal: 10,
    width: 310,
    alignSelf: 'center'
  },
  dropdown_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  },
  dropdown_container: {
    width: 310,
    alignSelf: 'center'
  },
  category_name_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

export default CourseDetails

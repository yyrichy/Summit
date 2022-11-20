import { useNavigation } from '@react-navigation/native'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Dimensions
} from 'react-native'
import AppContext from '../contexts/AppContext'
import Assignment from '../components/Assignment'
import {
  addAssignment,
  convertGradebook,
  parseCourseName,
  isNumber,
  calculateMarkColor
} from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Modal from 'react-native-modal'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '../colors/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'

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

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setMarks(
        await convertGradebook(
          await client.gradebook(marks.reportingPeriod.index)
        )
      )
    } catch (err) {}
    setRefreshing(false)
  }, [])

  useEffect(() => {
    if (isModalVisible) {
      setAssignmentName('')
      setPoints('')
      setTotal('')
    }
  }, [isModalVisible])

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <SafeAreaView style={styles.course_name_container}>
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
              color: Colors.navy
            }}
            underlayColor="none"
            activeOpacity={0.2}
            size={30}
            onPress={() => navigation.goBack()}
          ></FontAwesome.Button>
        </View>
        <Text numberOfLines={1} style={styles.course_name}>
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
              color: Colors.navy
            }}
            size={30}
            underlayColor="none"
            activeOpacity={0.2}
            onPress={() => toggleModal()}
          ></FontAwesome.Button>
          {Platform.OS === 'web' && (
            <FontAwesome.Button
              name="refresh"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.navy
              }}
              underlayColor="none"
              activeOpacity={0.2}
              size={30}
              onPress={onRefresh}
            ></FontAwesome.Button>
          )}
        </View>
      </SafeAreaView>
      <View
        style={[
          styles.course_mark_container,
          { borderColor: calculateMarkColor(course.value) }
        ]}
      >
        <Text numberOfLines={1} style={styles.course_mark}>
          {isNaN(course.value) ? 'N/A' : course.value}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderColor: Colors.secondary,
          borderTopWidth: 1,
          borderEndWidth: 1,
          borderStartWidth: 1,
          flex: 1
        }}
      >
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={500}
          parallelItems={5}
          itemsToFadeIn={Dimensions.get('window').height / 75}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 12,
            paddingTop: 8.5,
            paddingBottom: 10
          }}
          data={course.assignments}
          renderItem={({ item }) => (
            <Assignment
              name={item.name}
              courseName={courseName}
              key={item.name}
            ></Assignment>
          )}
        />
      </View>
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        onBackdropPress={toggleModal}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationInTiming={150}
        animationOutTiming={150}
        backdropTransitionOutTiming={0}
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
                marginHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5
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
                          backgroundColor: props.isSelected && Colors.light_gray
                        }
                      ]}
                      onPress={() => {
                        setCategory(props.value)
                        setOpen(false)
                      }}
                      activeOpacity={0.2}
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
              <FontAwesome.Button
                name="plus-circle"
                backgroundColor="transparent"
                iconStyle={{
                  color: Colors.navy
                }}
                style={{
                  margin: 0,
                  padding: 0
                }}
                size={55}
                underlayColor="none"
                activeOpacity={0.2}
                onPress={add}
              ></FontAwesome.Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    width: 300,
    height: 195
  },
  modal_view: {
    width: 300,
    height: 195
  },
  course_name: {
    fontSize: 24,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'Inter_800ExtraBold',
    textAlign: 'center'
  },
  course_name_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: 'transparent',
    padding: 5,
    marginHorizontal: 10,
    width: 210,
    alignSelf: 'center'
  },
  dropdown_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  },
  dropdown_container: {
    width: 210,
    alignSelf: 'center'
  },
  category_name_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  course_mark_container: {
    backgroundColor: Colors.white,
    marginBottom: 30,
    margin: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 3
  },
  course_mark: {
    textAlignVertical: 'center',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 50
  }
})

export default CourseDetails

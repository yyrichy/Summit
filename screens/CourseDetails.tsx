import { useNavigation } from '@react-navigation/native'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Dimensions,
  FlatList
} from 'react-native'
import AppContext from '../contexts/AppContext'
import Assignment from '../components/Assignment'
import {
  addAssignment,
  convertGradebook,
  isNumber,
  calculateMarkColor,
  roundTo,
  toggleCategory
} from '../gradebook/GradeUtil'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '../colors/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { Chip, FAB, TextInput, useTheme } from 'react-native-paper'

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()
  const theme = useTheme()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(courseName)

  const refInput = useRef(null)

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
        category,
        parseFloat(points),
        parseFloat(total)
      )
    )
    toggleModal()
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_gray }}>
      <SafeAreaView
        style={styles.course_name_container}
        edges={['top', 'left', 'right']}
      >
        <MaterialCommunityIcons.Button
          name="chevron-left"
          backgroundColor="transparent"
          iconStyle={{
            color: theme.colors.primary
          }}
          style={{ padding: 2 }}
          underlayColor="none"
          activeOpacity={0.2}
          size={40}
          onPress={() => navigation.goBack()}
        />
        <Text
          numberOfLines={2}
          style={[styles.course_name, { color: theme.colors.onBackground }]}
        >
          {courseName}
        </Text>
      </SafeAreaView>
      <View
        style={[
          styles.course_mark_container,
          {
            borderColor: calculateMarkColor(course.value),
            backgroundColor: Colors.white
          }
        ]}
      >
        <Text numberOfLines={1} style={styles.course_mark}>
          {isNaN(course.value) ? 'N/A' : course.value}
        </Text>
      </View>
      <View style={{ height: 32, marginBottom: 10, paddingLeft: 4 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={[...course.categories.entries()]}
          renderItem={({ item }) => {
            const selected = item[1].show
            return (
              <Chip
                selected={selected}
                mode={'flat'}
                style={{
                  marginHorizontal: 8,
                  height: 32,
                  backgroundColor: selected
                    ? theme.colors.secondaryContainer
                    : theme.colors.surface
                }}
                onPress={() => {
                  setMarks(toggleCategory(marks, course, item[1]))
                }}
              >
                {item[1].name}
              </Chip>
            )
          }}
          keyExtractor={(item) => item[1].name}
        />
      </View>
      <View
        style={{
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          flex: 1
        }}
      >
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={300}
          parallelItems={5}
          itemsToFadeIn={Dimensions.get('window').height / 75}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: 10
          }}
          data={course.assignments.filter(
            (a) => course.categories.get(a.category).show
          )}
          renderItem={({ item }) => (
            <Assignment
              name={item.name}
              courseName={courseName}
              key={item.name}
            ></Assignment>
          )}
        />
        <FAB
          icon={'plus'}
          onPress={toggleModal}
          variant={'primary'}
          style={{
            bottom: 12,
            right: 12,
            position: 'absolute'
          }}
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
              value={points}
              keyboardType="decimal-pad"
              autoComplete="off"
              placeholder="Points Earned"
              onChangeText={(t) => {
                if (isNumber(t) || t === '') setPoints(t)
              }}
              style={styles.input}
              textColor={Colors.black}
              placeholderTextColor={Colors.secondary}
              blurOnSubmit={false}
              onSubmitEditing={() => refInput.current.focus()}
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
              textColor={Colors.black}
              placeholderTextColor={Colors.secondary}
              ref={refInput}
              onSubmitEditing={() => setOpen(true)}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 10
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
              <MaterialCommunityIcons.Button
                name="plus-circle"
                backgroundColor="transparent"
                iconStyle={{
                  color: Colors.navy
                }}
                style={{ padding: 0, margin: 0, marginRight: -8 }}
                size={50}
                underlayColor="none"
                activeOpacity={0.2}
                onPress={add}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const getTotalGrade = (c, categories) => {
  const course = Object.assign({}, c)
  ;(course.points = 0), (course.total = 0), (course.value = NaN)
  for (const category of categories.values()) {
    ;(category.points = 0), (category.total = 0), (category.value = NaN)
  }
  for (const assignment of course.assignments) {
    const category = categories.get(assignment.category)
    if (category && !isNaN(assignment.points) && !isNaN(assignment.total)) {
      category.points += assignment.points
      category.total += assignment.total
      category.value = category.points / category.total
    }
  }
  for (const category of categories.values()) {
    if (!isNaN(category.value)) {
      course.points += category.value * category.weight
      course.total += category.weight
    }
  }
  return roundTo((course.points / course.total) * 100, 2)
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    height: 36,
    backgroundColor: 'transparent',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    borderRadius: 4
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: 320,
    padding: 16
  },
  modal_view: {
    width: 320
  },
  course_name: {
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'Inter_800ExtraBold',
    marginRight: 8
  },
  course_name_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: 'transparent',
    alignSelf: 'center'
  },
  dropdown_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  },
  dropdown_container: {
    width: 240,
    alignSelf: 'center'
  },
  category_name_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  course_mark_container: {
    marginVertical: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 3
  },
  course_mark: {
    textAlignVertical: 'center',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 50
  }
})

export default CourseDetails

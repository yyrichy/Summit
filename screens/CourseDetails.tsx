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
  FlatList,
  ScrollView
} from 'react-native'
import AppContext from '../contexts/AppContext'
import Assignment from '../components/Assignment'
import {
  addAssignment,
  convertGradebook,
  isNumber,
  calculateMarkColor,
  toggleCategory,
  parseCourseName
} from '../gradebook/GradeUtil'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '../colors/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Chip, FAB, TextInput, useTheme } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

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
        convertGradebook(await client.gradebook(marks.reportingPeriod.index))
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
    <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level3 }}>
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
        <Text numberOfLines={2} style={styles.course_name}>
          {parseCourseName(courseName)}
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
      <View style={{ height: 32, marginBottom: 15, paddingLeft: 4 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={[...course.categories.values()]}
          renderItem={({ item }) => {
            const selected = item.show
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
                  setMarks(toggleCategory(marks, course, item))
                }}
              >
                {item.name}
              </Chip>
            )
          }}
          keyExtractor={(item) => item.name}
        />
      </View>
      <View
        style={{
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flex: 1,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        }}
      >
        <GestureHandlerRootView>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 14,
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            {course.assignments
              .filter((a) => course.categories.get(a.category)?.show)
              .map((item) => (
                <Assignment
                  name={item.name}
                  courseName={courseName}
                  key={item.name}
                ></Assignment>
              ))}
          </ScrollView>
        </GestureHandlerRootView>
        {course.categories.size > 0 && (
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
        )}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <TextInput
                returnKeyType={'next'}
                value={points}
                keyboardType="decimal-pad"
                autoComplete="off"
                placeholder="Score"
                onChangeText={(t) => {
                  if (isNumber(t) || t === '') setPoints(t)
                }}
                style={styles.input}
                textColor={Colors.black}
                placeholderTextColor={Colors.secondary}
                blurOnSubmit={false}
                onSubmitEditing={() => refInput.current.focus()}
                autoCorrect={false}
              />
              <Text style={{ fontSize: 48 }}>/</Text>
              <TextInput
                returnKeyType={'next'}
                value={total}
                keyboardType="decimal-pad"
                autoComplete="off"
                placeholder="Total"
                onChangeText={(t) => {
                  if (isNumber(t) || t === '') setTotal(t)
                }}
                style={styles.input}
                textColor={Colors.black}
                placeholderTextColor={Colors.secondary}
                ref={refInput}
                onSubmitEditing={() => setOpen(true)}
                autoCorrect={false}
              />
            </View>
            <View
              style={{ height: 32, marginBottom: 16, marginHorizontal: 16 }}
            >
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={[...course.categories.values()]}
                renderItem={({ item }) => {
                  const selected = category === item.name
                  return (
                    <Chip
                      selected={selected}
                      mode={'flat'}
                      style={{
                        marginRight: 16,
                        height: 32,
                        backgroundColor: selected
                          ? theme.colors.secondaryContainer
                          : theme.colors.surfaceVariant
                      }}
                      onPress={() => {
                        setCategory(item.name)
                        setOpen(false)
                      }}
                    >
                      {item.name}
                    </Chip>
                  )
                }}
                keyExtractor={(item) => item.name}
              />
            </View>
            <Button
              mode="contained"
              onPress={add}
              style={{ marginHorizontal: 16 }}
            >
              Add Assignment
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center'
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 320,
    padding: 26
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

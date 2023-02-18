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
  calculateBarColor,
  parseCourseName
} from '../gradebook/GradeUtil'
import Modal from 'react-native-modal'
import { Colors } from '../colors/Colors'
import {
  Appbar,
  Button,
  Chip,
  FAB,
  ProgressBar,
  TextInput,
  useTheme
} from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { round } from '../util/Util'
import BannerAd from '../components/BannerAd'
import Constants from 'expo-constants'
import { onOpen, Picker } from 'react-native-actions-sheet-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const CourseDetails = ({ route }) => {
  const navigation = useNavigation()
  const theme = useTheme()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(route.params.title)

  const refInput = useRef(null)

  const [infoModalVisible, setInfoModal] = useState(false)

  const [assignmentModalVisible, setAssignmentModal] = useState(false)
  const [category, setCategory] = useState(
    marks.courses.get(course.name).categories.values().next().value?.name
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
    if (assignmentModalVisible) {
      setPoints('')
      setTotal('')
    }
  }, [assignmentModalVisible])

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
    setAssignmentModal(!assignmentModalVisible)
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
      <Picker
        id="categoryPicker"
        data={[...course.categories.values()]}
        searchable={false}
        label="Select Marking Period"
        setSelected={(category) => setCategory(category.name)}
      />
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level3 }}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content
          title={parseCourseName(course.name)}
          titleStyle={{
            fontFamily: 'Montserrat_500Medium',
            alignSelf: 'flex-start'
          }}
        />
        <Appbar.Action
          icon="information-outline"
          onPress={() => setInfoModal(true)}
        />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      <View style={styles.course_info_container}>
        <View
          style={[
            styles.course_mark_container,
            {
              borderColor: calculateMarkColor(course.value)
            }
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.course_mark,
              { color: calculateMarkColor(course.value) }
            ]}
          >
            {isNaN(course.value) ? 'N/A' : round(course.value, 2)}
          </Text>
        </View>
        {course.categories.size > 0 && (
          <View style={{ flex: 1, marginLeft: 12 }}>
            {[...course.categories.values()].map((item) => {
              const value = round(item.value, 2)
              const hasValue = !isNaN(value)
              return (
                <View
                  key={item.name}
                  style={{
                    justifyContent: 'space-evenly',
                    flex: 1
                  }}
                >
                  <View style={styles.category_details}>
                    <Text style={styles.category_name_text} numberOfLines={2}>
                      {item.name} {`(${item.weight}%)`}
                    </Text>
                    <Text style={styles.category_mark_text} numberOfLines={2}>
                      {hasValue ? value : 'N/A'}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={hasValue ? value / 100 : 0}
                    style={{ backgroundColor: calculateBarColor(value) }}
                  />
                </View>
              )
            })}
          </View>
        )}
      </View>
      {course.categories.size > 0 && (
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
                      : theme.colors.surfaceVariant
                  }}
                  onPress={() => {
                    setMarks(toggleCategory(marks, course, item))
                  }}
                  textStyle={{
                    marginTop: 5
                  }}
                >
                  {item.name}
                </Chip>
              )
            }}
            keyExtractor={(item) => item.name}
          />
        </View>
      )}
      <View
        style={[
          styles.assignment_list_container,
          {
            shadowColor: theme.colors.shadow,
            backgroundColor: theme.colors.background
          }
        ]}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.assignment_scrollview_container}
          >
            {course.assignments
              .filter((a) => course.categories.get(a.category)?.show)
              .map((item) => (
                <Assignment
                  name={item.name}
                  courseName={course.name}
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
              bottom: 16,
              right: 16,
              position: 'absolute'
            }}
          />
        )}
      </View>
      <View style={{ backgroundColor: theme.colors.surface }}>
        <BannerAd
          androidId={Constants.expoConfig.extra.DETAILS_BANNER_ANDROID}
          iosId={Constants.expoConfig.extra.DETAILS_BANNER_IOS}
        />
      </View>
      <Modal
        isVisible={assignmentModalVisible}
        coverScreen={false}
        onBackdropPress={toggleModal}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={150}
        animationOutTiming={150}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modal}>
          <View style={styles.points_input_container}>
            <TextInput
              returnKeyType={'next'}
              keyboardType="decimal-pad"
              autoComplete="off"
              onChangeText={(t) => {
                if (isNumber(t) || t === '') setPoints(t)
              }}
              style={styles.input}
              textColor={Colors.black}
              placeholderTextColor={Colors.secondary}
              blurOnSubmit={false}
              onSubmitEditing={() => refInput.current.focus()}
            />
            <Text style={styles.dash}>/</Text>
            <TextInput
              returnKeyType={'next'}
              keyboardType="decimal-pad"
              autoComplete="off"
              onChangeText={(t) => {
                if (isNumber(t) || t === '') setTotal(t)
              }}
              style={styles.input}
              textColor={Colors.black}
              placeholderTextColor={Colors.secondary}
              ref={refInput}
            />
          </View>
          <Chip
            mode="outlined"
            style={{
              height: 32,
              alignSelf: 'flex-start',
              marginBottom: 15,
              marginRight: 20
            }}
            onPress={() => onOpen('categoryPicker')}
            icon="chevron-down"
            textStyle={{
              marginTop: 5
            }}
          >
            {category}
          </Chip>
          <View style={{ width: '100%' }}>
            <Button mode="contained" onPress={add}>
              Add Assignment
            </Button>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={infoModalVisible}
        coverScreen={false}
        onBackdropPress={() => setInfoModal(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={150}
        animationOutTiming={150}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.info_modal}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <Text style={styles.info_modal_course_title}>{course.name}</Text>
            <View
              style={{
                alignSelf: 'flex-start',
                marginLeft: 10
              }}
            >
              <MaterialCommunityIcons.Button
                name="close"
                backgroundColor="transparent"
                iconStyle={{
                  color: theme.colors.onSurfaceVariant,
                  alignSelf: 'flex-end'
                }}
                style={{
                  padding: 0,
                  marginRight: -10
                }}
                underlayColor="none"
                size={24}
                onPress={() => setInfoModal(false)}
              />
            </View>
          </View>
          <View style={styles.property_container}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={20}
              color={Colors.secondary}
            />
            <Text style={styles.property_text}>{course.teacher.name}</Text>
          </View>
          <View style={styles.property_container}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={Colors.secondary}
            />
            <Text style={styles.property_text}>{course.teacher.email}</Text>
          </View>
          <View style={styles.property_container}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color={Colors.secondary}
            />
            <Text style={styles.property_text}>Room {course.room}</Text>
          </View>
          <View style={styles.property_container}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={20}
              color={Colors.secondary}
            />
            <Text style={styles.property_text}>
              {marks.reportingPeriod.name}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: 'Inter_400Regular',
    fontSize: 30,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center'
  },
  modal: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 300,
    padding: 20
  },
  info_modal: {
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 300,
    padding: 20
  },
  course_name: {
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'Inter_800ExtraBold',
    marginRight: 8
  },
  course_info_container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 15,
    justifyContent: 'center'
  },
  course_name_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  course_mark_container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    backgroundColor: Colors.corn_silk_white,
    maxWidth: '50%',
    minWidth: '25%'
  },
  course_mark: {
    textAlignVertical: 'center',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 42
  },
  category_details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignContent: 'flex-start'
  },
  category_name_text: {
    fontSize: 12,
    flex: 1,
    marginRight: 2,
    maxWidth: '75%'
  },
  category_mark_text: {
    fontSize: 12,
    fontWeight: 'bold',
    maxWidth: '25%'
  },
  assignment_list_container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  assignment_scrollview_container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10
  },
  points_input_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  dash: {
    fontSize: 48,
    marginHorizontal: 20,
    fontFamily: 'Inter_300Light'
  },
  info_modal_course_title: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    flex: 1
  },
  property_container: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'center'
  },
  property_text: {
    marginLeft: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.medium_gray,
    flexShrink: 1
  }
})

export default CourseDetails

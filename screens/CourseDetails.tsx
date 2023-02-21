import { useNavigation } from '@react-navigation/native'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import AppContext from '../contexts/AppContext'
import Assignment from '../components/Assignment'
import {
  addAssignment,
  convertGradebook,
  isNumber,
  calculateMarkColor,
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
import { palette } from '../theme/colors'

const CourseDetails = ({ route }) => {
  const navigation = useNavigation()
  const theme = useTheme()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(route.params.title)

  const [searchModalVisible, setSearchModal] = useState(false)
  const [text, setText] = useState(undefined)
  const [searchText, setSearchText] = useState(undefined)
  const [infoModalVisible, setInfoModal] = useState(false)
  const [assignmentModalVisible, setAssignmentModal] = useState(false)
  const [category, setCategory] = useState(
    marks.courses.get(course.name).categories.values().next().value?.name
  )
  const [points, setPoints] = useState('')
  const [total, setTotal] = useState('')

  const [categories, setCategories] = useState(
    [...course.categories.values()].map((c) => ({
      name: c.name,
      show: true
    })) as { name: string; show: boolean }[]
  )

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setSearchText(null)
    setText(null)
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
    setAssignmentModal(false)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark
          ? palette.neutralVariant10
          : theme.colors.elevation.level1
      }}
    >
      <Picker
        id="categoryPicker"
        data={[...course.categories.values()]}
        searchable={false}
        label="Select Marking Period"
        setSelected={(category) => setCategory(category.name)}
      />
      <Appbar.Header
        style={{
          backgroundColor: theme.dark
            ? palette.neutralVariant10
            : theme.colors.elevation.level1
        }}
      >
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content
          title={parseCourseName(course.name)}
          titleStyle={{
            alignSelf: 'flex-start'
          }}
        />
        <Appbar.Action icon="magnify" onPress={() => setSearchModal(true)} />
        <Appbar.Action
          icon="information-outline"
          onPress={() => setInfoModal(true)}
        />
      </Appbar.Header>
      <View style={styles.course_info_container}>
        <View
          style={[
            styles.course_mark_container,
            {
              borderColor: calculateMarkColor(course.value),
              backgroundColor: theme.dark
                ? palette.neutralVariant20
                : theme.colors.surfaceVariant
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
                    <Text
                      style={[
                        styles.category_name_text,
                        { color: theme.colors.onSurface }
                      ]}
                      numberOfLines={2}
                    >
                      {item.name} {`(${item.weight}%)`}
                    </Text>
                    <Text
                      style={[
                        styles.category_mark_text,
                        { color: theme.colors.onSurface }
                      ]}
                      numberOfLines={2}
                    >
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
            data={categories}
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
                    const index = categories.findIndex(
                      (c) => c.name === item.name
                    )
                    const c = [...categories]
                    const newCategory = c[index]
                    newCategory.show = !item.show
                    c[index] = newCategory
                    setCategories(c)
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
            contentContainerStyle={styles.assignment_scrollview_container}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {course.assignments
              .filter(
                (a) =>
                  categories.find((c) => c.name === a.category).show &&
                  (searchText
                    ? a.name.toLowerCase().includes(searchText.toLowerCase())
                    : true)
              )
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
            onPress={() => setAssignmentModal(true)}
            variant={'primary'}
            style={{
              bottom: 16,
              right: 16,
              position: 'absolute'
            }}
          />
        )}
      </View>
      {false && (
        <View style={{ backgroundColor: theme.colors.surface }}>
          <BannerAd
            androidId={Constants.expoConfig.extra.DETAILS_BANNER_ANDROID}
            iosId={Constants.expoConfig.extra.DETAILS_BANNER_IOS}
          />
        </View>
      )}
      <Modal
        isVisible={assignmentModalVisible}
        coverScreen={false}
        onBackdropPress={() => setAssignmentModal(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={150}
        animationOutTiming={150}
        backdropTransitionOutTiming={0}
      >
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.points_input_container}>
            <TextInput
              mode="outlined"
              returnKeyType={'next'}
              keyboardType="decimal-pad"
              autoComplete="off"
              onChangeText={(t) => {
                if (isNumber(t) || t === '') setPoints(t)
              }}
              style={styles.input}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              keyboardType="decimal-pad"
              autoComplete="off"
              onChangeText={(t) => {
                if (isNumber(t) || t === '') setTotal(t)
              }}
              style={[styles.input, { marginLeft: 20 }]}
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
        <View
          style={[styles.info_modal, { backgroundColor: theme.colors.surface }]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <Text
              style={[
                styles.info_modal_course_title,
                { color: theme.colors.onSurfaceVariant }
              ]}
            >
              {course.name}
            </Text>
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
      <Modal
        isVisible={searchModalVisible}
        coverScreen={false}
        onBackdropPress={() => setSearchModal(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={150}
        animationOutTiming={150}
        backdropTransitionOutTiming={0}
      >
        <View
          style={[styles.info_modal, { backgroundColor: theme.colors.surface }]}
        >
          <TextInput
            mode="outlined"
            autoCapitalize="none"
            style={{
              marginBottom: 15
            }}
            label="Enter assignment name"
            onChangeText={(text) => setText(text)}
            value={text}
            placeholderTextColor={Colors.medium_gray}
          />
          <View style={{ flexDirection: 'row' }}>
            <Button
              mode="contained"
              onPress={() => {
                setSearchModal(false)
                setSearchText(text)
              }}
            >
              Search
            </Button>
            <Button
              onPress={() => {
                setSearchModal(false)
                setSearchText(null)
                setText(null)
              }}
            >
              Clear
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    alignItems: 'center',
    fontSize: 28
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
    fontFamily: 'Inter_200ExtraLight'
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

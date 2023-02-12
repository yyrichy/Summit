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
  parseCourseName,
  calculateBarColor
} from '../gradebook/GradeUtil'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { Colors } from '../colors/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
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

const CourseDetails = ({ route }) => {
  const courseName = route.params.title
  const navigation = useNavigation()
  const theme = useTheme()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(courseName)

  const refInput = useRef(null)

  const [isModalVisible, setModalVisible] = useState(false)
  const [category, setCategory] = useState(
    marks.courses.get(courseName).categories.values().next().value?.name
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
        style={{
          flexDirection: 'row',
          paddingHorizontal: 12,
          marginBottom: 25,
          marginTop: 10,
          justifyContent: 'center'
        }}
      >
        <View
          style={[
            styles.course_mark_container,
            {
              borderColor: calculateMarkColor(course.value),
              backgroundColor: Colors.corn_silk_white,
              maxWidth: '50%',
              minWidth: '25%'
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
                      style={{
                        fontSize: 12,
                        flex: 1,
                        marginRight: 2,
                        maxWidth: '75%'
                      }}
                      numberOfLines={2}
                    >
                      {item.name} {`(${item.weight}%)`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        maxWidth: '25%'
                      }}
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
      )}
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
              paddingHorizontal: 12,
              paddingTop: 8,
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
      <View style={{ backgroundColor: theme.colors.background }}>
        <BannerAd
          iosId={Constants.expoConfig.extra.DETAILS_BANNER_IOS}
          androidId={Constants.expoConfig.extra.DETAILS_BANNER_ANDROID}
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
            />
            <Text style={{ fontSize: 48 }}>/</Text>
            <TextInput
              returnKeyType={'next'}
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
            />
          </View>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}
          >
            {[...course.categories.values()].map((item) => {
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
                      : theme.colors.surfaceVariant,
                    marginBottom: 8
                  }}
                  onPress={() => {
                    setCategory(item.name)
                  }}
                  key={item.name}
                >
                  {item.name}
                </Chip>
              )
            })}
          </View>
          <Button mode="contained" onPress={add} style={{ width: '100%' }}>
            Add Assignment
          </Button>
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
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 320,
    padding: 20
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24
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
  }
})

export default CourseDetails

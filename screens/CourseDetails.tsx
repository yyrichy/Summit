import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  FlatList,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import AppContext from '../contexts/AppContext'
import Assignment from '../components/Assignment'
import {
  addAssignment,
  convertGradebook,
  calculateMarkColor,
  parseCourseName
} from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { Appbar, Button, Chip, Dialog, FAB, Portal, TextInput, useTheme } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { isNumber, round } from '../util/Util'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { palette } from '../theme/colors'
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTheme
} from 'victory-native'
import { format } from 'date-fns'
import LinearGradient from 'react-native-linear-gradient'

const CourseDetails = ({ route }) => {
  const navigation = useNavigation()
  const theme = useTheme()

  const { marks, client, setMarks } = useContext(AppContext)
  const course = marks.courses.get(route.params.title)

  const [searchDialogVisible, toggleSearchDialog] = useReducer((s) => !s, false)
  const [text, setText] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const [infoDialogVisible, toggleInfoDialog] = useReducer((s) => !s, false)
  const [assignmentDialogVisible, toggleAssignmentDialog] = useReducer((s) => !s, false)
  const [assignmentCategory, setAssignmentCategory] = useState(
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
  const refresh = async () => {
    setRefreshing(true)
    setSearchText(null)
    setText(null)
    try {
      setMarks(convertGradebook(await client.gradebook(marks.reportingPeriod.index)))
    } catch (err) {}
    setRefreshing(false)
  }

  const data = []
  for (const time in course.data) {
    data.push({ x: new Date(time), y: course.data[time].value })
  }

  useEffect(() => {
    if (assignmentDialogVisible) {
      setPoints('')
      setTotal('')
    }
  }, [assignmentDialogVisible])

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [])

  const add = () => {
    setMarks(
      addAssignment(marks, course, assignmentCategory, parseFloat(points), parseFloat(total))
    )
    toggleAssignmentDialog()
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content
          titleStyle={{ fontFamily: 'RobotoSerif_700Bold_Italic' }}
          title={parseCourseName(course.name)}
        />
        <Appbar.Action icon="magnify" onPress={toggleSearchDialog} />
        <Appbar.Action icon="information-outline" onPress={toggleInfoDialog} />
        <Appbar.Action icon="refresh" onPress={refresh} />
      </Appbar.Header>
      <View style={styles.course_info_container}>
        <View
          style={[
            styles.course_mark_container,
            {
              backgroundColor: theme.dark
                ? theme.colors.elevation.level3
                : theme.colors.surfaceVariant
            }
          ]}
        >
          <Text
            numberOfLines={1}
            style={[styles.course_mark, { color: calculateMarkColor(course.value) }]}
          >
            {isNaN(course.value) ? 'N/A' : round(course.value, 2)}
          </Text>
        </View>
        {course.categories.size > 0 && (
          <View style={{ marginLeft: 20, height: 80, flex: 1 }}>
            <FlatList
              data={[...course.categories.values()]}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const value = round(item.value, 2)
                const hasValue = !isNaN(value)
                const progressValue = hasValue ? value / 100 : 0
                return (
                  <LinearGradient
                    key={item.name}
                    style={{
                      padding: 14,
                      borderRadius: 12
                    }}
                    colors={[
                      theme.colors.elevation.level5,
                      theme.colors.elevation.level5,
                      theme.colors.elevation.level2
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0, progressValue, progressValue]}
                  >
                    <View style={styles.category_details}>
                      <Text
                        style={[styles.category_name_text, { color: theme.colors.onSurface }]}
                        numberOfLines={2}
                      >
                        {item.name} {`(${item.weight}%)`}
                      </Text>
                      <Text
                        style={[styles.category_mark_text, { color: theme.colors.onSurface }]}
                        numberOfLines={1}
                      >
                        {hasValue ? value : 'N/A'}
                      </Text>
                    </View>
                  </LinearGradient>
                )
              }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>
        )}
      </View>
      {categories && (
        <View style={{ height: 32, paddingLeft: 12, marginTop: 20, marginBottom: 15 }}>
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
                    marginRight: 16,
                    height: 32,
                    backgroundColor: selected
                      ? theme.colors.secondaryContainer
                      : theme.colors.surfaceVariant
                  }}
                  onPress={() => {
                    const index = categories.findIndex((c) => c.name === item.name)
                    const c = [...categories]
                    const newCategory = c[index]
                    newCategory.show = !selected
                    c[index] = newCategory
                    setCategories(c)
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
            backgroundColor: theme.colors.elevation.level2
          }
        ]}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          {refreshing ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator
                color={Colors.secondary}
                animating={true}
                size="large"
                style={{
                  alignSelf: 'center',
                  flex: 1,
                  justifyContent: 'center'
                }}
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.assignment_scrollview_container}>
              {course.assignments
                .filter(
                  (a) =>
                    (!categories.find((c) => c.name === a.category) ||
                      categories.find((c) => c.name === a.category).show) &&
                    (!searchText || a.name.toLowerCase().includes(searchText.toLowerCase()))
                )
                .map((item) => (
                  <Assignment
                    name={item.name}
                    courseName={course.name}
                    key={item.name}
                  ></Assignment>
                ))}
            </ScrollView>
          )}
        </GestureHandlerRootView>
        {course.categories.size > 0 && (
          <FAB
            icon={'plus'}
            onPress={toggleAssignmentDialog}
            variant={'primary'}
            style={{
              bottom: 16,
              right: 16,
              position: 'absolute'
            }}
          />
        )}
      </View>
      <Portal>
        <Dialog
          visible={assignmentDialogVisible}
          onDismiss={toggleAssignmentDialog}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Content>
            <View style={styles.points_input_container}>
              <TextInput
                mode="outlined"
                label="Score"
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
                label="Total"
                keyboardType="decimal-pad"
                autoComplete="off"
                onChangeText={(t) => {
                  if (isNumber(t) || t === '') setTotal(t)
                }}
                style={[styles.input, { marginLeft: 20 }]}
              />
            </View>
            <View style={{ height: 32 }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={[...course.categories.values()]}
                renderItem={({ item }) => {
                  const selected = assignmentCategory === item.name
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
                        setAssignmentCategory(item.name)
                      }}
                    >
                      {item.name}
                    </Chip>
                  )
                }}
                keyExtractor={(item) => item.name}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleAssignmentDialog}>Cancel</Button>
            <Button mode="contained" labelStyle={{ marginHorizontal: 24 }} onPress={add}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={infoDialogVisible}
          onDismiss={toggleInfoDialog}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>{course.name}</Dialog.Title>
          <Dialog.Content>
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={20}
                color={Colors.secondary}
              />
              <Text style={styles.property_text}>{course.teacher.name}</Text>
            </View>
            <View style={styles.property_container}>
              <MaterialCommunityIcons name="email-outline" size={20} color={Colors.secondary} />
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
              <MaterialCommunityIcons name="calendar-outline" size={20} color={Colors.secondary} />
              <Text style={styles.property_text}>{marks.reportingPeriod.name}</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <VictoryChart
                height={200}
                theme={VictoryTheme.material}
                scale={{ x: 'time', y: 'linear' }}
                maxDomain={{ y: 100 }}
                minDomain={{ y: 50 }}
                animate={true}
                padding={{ top: 10, left: 90, right: 70, bottom: 50 }}
              >
                <VictoryAxis
                  dependentAxis={true}
                  style={{
                    grid: { stroke: theme.dark ? palette.neutralVariant20 : Colors.light_gray },
                    tickLabels: { fill: theme.colors.onSurfaceVariant }
                  }}
                />
                <VictoryAxis
                  tickFormat={(x) => `${format(new Date(x), 'M/dd')}`}
                  style={{
                    grid: { stroke: theme.dark ? palette.neutralVariant20 : Colors.light_gray },
                    tickLabels: { fill: theme.colors.onSurfaceVariant }
                  }}
                />
                <VictoryArea
                  interpolation="linear"
                  data={data}
                  style={{
                    data: {
                      stroke: theme.colors.onSurface,
                      strokeWidth: 1,
                      fill: theme.dark ? '#44444444' : '#44444411'
                    }
                  }}
                />
                <VictoryScatter
                  style={{
                    data: {
                      fill: ({ datum }) => calculateMarkColor(datum.y)
                    }
                  }}
                  size={5}
                  data={data}
                />
              </VictoryChart>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleInfoDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={searchDialogVisible}
          onDismiss={toggleSearchDialog}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>Search Assignments</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Enter assignment name"
              onChangeText={(text) => setText(text)}
              value={text}
              placeholderTextColor={Colors.medium_gray}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                toggleSearchDialog()
                setSearchText(null)
                setText(null)
              }}
            >
              Clear
            </Button>
            <Button
              mode="contained"
              labelStyle={{ marginHorizontal: 24 }}
              onPress={() => {
                toggleSearchDialog()
                setSearchText(text)
              }}
            >
              Search
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 28
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
    height: 80,
    paddingHorizontal: 15,
    borderRadius: 24,
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
    alignItems: 'center',
    flexWrap: 'wrap',
    alignContent: 'flex-start'
  },
  category_name_text: {
    fontSize: 10,
    flex: 1,
    marginRight: 8,
    fontFamily: 'Inter_400Regular'
  },
  category_mark_text: {
    fontSize: 12,
    maxWidth: '25%',
    fontFamily: 'Inter_700Bold'
  },
  assignment_list_container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1
  },
  assignment_scrollview_container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10
  },
  points_input_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
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

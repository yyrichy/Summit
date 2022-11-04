import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/AppContext'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import Course from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import { convertGradebook, parseCourseName } from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Colors } from '../colors/Colors'
import Constants from 'expo-constants'

const Courses = ({ navigation }) => {
  const { client, marks, setMarks } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(marks.reportingPeriod.index)
  const [periods, setPeriods] = useState(
    marks.reportingPeriods.map((p) => {
      return { label: p.name, value: p.index }
    })
  )

  useEffect(() => {
    onRefresh()
  }, [value])

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      setMarks(await convertGradebook(await client.gradebook(value)))
    } catch (err) {}
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={periods}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setPeriods}
        maxHeight={null}
        style={styles.dropdown}
        textStyle={styles.dropdown_text}
        translation={{
          PLACEHOLDER: 'Select Marking Period'
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
                setValue(props.value)
                setOpen(false)
              }}
              activeOpacity={0.5}
            >
              <View style={styles.marking_period_container}>
                <Text numberOfLines={1} style={props.listItemLabelStyle}>
                  {props.label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
      ></DropDownPicker>
      <View style={styles.row_container}>
        {!isNaN(marks.gpa) && (
          <View style={styles.gpa_container}>
            <Text style={styles.gpa}>{marks.gpa} GPA</Text>
          </View>
        )}
        {Platform.OS === 'web' && (
          <View style={styles.refresh_button_container}>
            <FontAwesome.Button
              name="refresh"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.secondary
              }}
              underlayColor="none"
              activeOpacity={0.5}
              size={24}
              onPress={onRefresh}
            ></FontAwesome.Button>
          </View>
        )}
      </View>
      {marks && (
        <FlatList
          data={[...marks.courses.entries()]}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (item[1].categories.size > 1) {
                  navigation.navigate('Course Details', { title: item[0] })
                }
              }}
            >
              <Course
                name={parseCourseName(item[0])}
                mark={item[1].value}
                period={item[1].period}
                teacher={item[1].teacher}
              ></Course>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item[0]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        marginTop: Constants.statusBarHeight
      }
    })
  },
  // android status bar not accounted for properly in safeview + dropdownpicker
  // web needs to be shifted 11 right
  dropdown: {
    borderWidth: 0,
    height: 30,
    marginBottom: 15,
    backgroundColor: 'transparent'
  },
  dropdown_text: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30
  },
  marking_period_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  gpa_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  gpa: {
    marginLeft: 11,
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22
  },
  refresh_button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default Courses

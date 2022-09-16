import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/AppContext'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform
} from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import CourseComponent from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import GradeUtil from '../gradebook/GradeUtil'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { showMessage } from 'react-native-flash-message'
import { Colors } from '../colors/Colors'
import AwesomeAlert from 'react-native-awesome-alerts'
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
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    setIsLoading(true)
    let isSubscribed = true
    const getGradebook = async () => {
      try {
        const marks = await GradeUtil.convertGradebook(
          await client.gradebook(value)
        )
        if (isSubscribed) {
          setMarks(marks)
        }
      } catch (err) {
        setErrorMessage(err.message)
        setShowAlert(true)
      }
    }
    getGradebook()
    setIsLoading(false)
    return () => {
      isSubscribed = false
    }
  }, [value])

  const refreshMarks = async () => {
    setIsLoading(true)
    try {
      const gradebook = await client.gradebook(value)
      const newMarks = await GradeUtil.convertGradebook(gradebook)
      setMarks(newMarks)
    } catch (err) {
      setErrorMessage(err.message)
      setShowAlert(true)
      setIsLoading(false)
      return
    }
    showMessage({
      message: 'Gradebook refreshed',
      type: 'info',
      icon: 'success'
    })
    setIsLoading(false)
  }

  return (
    <>
      <SafeAreaView
        style={{ flex: 1 }}
        pointerEvents={isLoading ? 'none' : 'auto'}
      >
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
          listItemLabelStyle={styles.dropdown_label}
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
              >
                <View style={styles.district_name_container}>
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
              onPress={() => refreshMarks()}
            ></FontAwesome.Button>
          </View>
        </View>
        {marks != undefined && (
          <FlatList
            data={[...marks.courses.entries()]}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Course Details', { title: item[0] })
                }
              >
                <CourseComponent
                  name={GradeUtil.parseCourseName(item[0])}
                  mark={item[1].value}
                  period={item[1].period}
                  teacher={item[1].teacher}
                ></CourseComponent>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item[0]}
          />
        )}
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
  // android status bar not accounted for properly in safeview + dropdownpicker
  // web needs to be shifted 11 right
  dropdown: {
    borderWidth: 0,
    height: 30,
    marginBottom: 15,
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    marginLeft: Platform.OS === 'web' ? 11 : 0,
    backgroundColor: 'transparent'
  },
  dropdown_text: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30
  },
  dropdown_label: {
    marginLeft: Platform.OS === 'web' ? 11 : 0
  },
  district_name_container: {
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

export default Courses

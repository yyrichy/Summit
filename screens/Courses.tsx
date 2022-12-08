import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/AppContext'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  BackHandler
} from 'react-native'
import Course from '../components/Course'
import DropDownPicker from 'react-native-dropdown-picker'
import { convertGradebook, dateDiffInDays } from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerForPushNotificationsAsync } from '../util/Notification'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'

const Courses = ({ navigation }) => {
  const { client, marks, setMarks } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(marks.reportingPeriod.index)
  const [periods, setPeriods] = useState(
    marks.reportingPeriods.map((p) => {
      return { label: p.name, value: p.index }
    })
  )
  const endDate = marks.reportingPeriods[value].date.end
  const daysDiff = dateDiffInDays(
    new Date(),
    marks.reportingPeriods[value].date.end
  )

  useEffect(() => {
    onRefresh()
  }, [value])

  useEffect(() => {
    registerForPushNotificationsAsync()

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

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      setMarks(convertGradebook(await client.gradebook(value)))
    } catch (err) {}
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <DropDownPicker
        open={open}
        value={value}
        items={periods}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setPeriods}
        maxHeight={null}
        style={styles.dropdown}
        labelProps={{ numberOfLines: 1 }}
        textStyle={[styles.dropdown_text, { fontSize: 50 }]}
        translation={{
          PLACEHOLDER: 'Select Marking Period'
        }}
        renderListItem={(props) => {
          return (
            <TouchableOpacity
              {...props}
              style={[
                {
                  backgroundColor: props.isSelected && Colors.light_gray
                }
              ]}
              onPress={() => {
                setValue(props.value)
                setOpen(false)
              }}
              activeOpacity={0.2}
            >
              <View style={styles.marking_period_container}>
                <Text
                  numberOfLines={1}
                  style={[styles.dropdown_text, { fontSize: 25 }]}
                >
                  {props.label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
      ></DropDownPicker>
      {!isNaN(marks.gpa) && <Text style={styles.gpa}>GPA - {marks.gpa}</Text>}
      <Text style={styles.date}>
        {daysDiff < 0
          ? `Ended ${Math.abs(daysDiff)} days ago`
          : `Ends in ${daysDiff} days`}{' '}
        on {endDate.toLocaleDateString()}
      </Text>
      {marks && (
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={500}
          parallelItems={5}
          itemsToFadeIn={10}
          data={[...marks.courses.entries()]}
          renderItem={({ item }) => (
            <Course
              name={item[0]}
              mark={item[1].value}
              period={item[1].period}
              teacher={item[1].teacher}
              onPress={() => {
                navigation.navigate('Course Details', { title: item[0] })
              }}
            ></Course>
          )}
          keyExtractor={(item) => item[0]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingHorizontal: 7
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dropdown: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  dropdown_text: {
    fontFamily: 'Inter_800ExtraBold'
  },
  marking_period_container: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 11
  },
  date: {
    marginLeft: 11,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 18
  },
  gpa_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  gpa: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 25,

    marginLeft: 11
  }
})

export default Courses

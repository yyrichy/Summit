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
import { convertGradebook } from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerForPushNotificationsAsync } from '../util/Notification'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { MD3LightTheme } from '../theme/MD3LightTheme'
import { Picker, onOpen } from 'react-native-actions-sheet-picker'
import { ReportingPeriod } from 'studentvue'
import { useTheme } from 'react-native-paper'

const Courses = ({ navigation }) => {
  const theme = useTheme()
  const { client, marks, setMarks } = useContext(AppContext)
  const [selected, setSelected] = useState(
    marks.reportingPeriod as ReportingPeriod
  )
  const endDate = selected.date.end
  useEffect(() => {
    onRefresh()
  }, [selected])

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
      setMarks(convertGradebook(await client.gradebook(selected.index)))
    } catch (err) {}
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Picker
        id="mp"
        data={marks.reportingPeriods}
        searchable={false}
        label="Select Marking Period"
        setSelected={setSelected}
      />

      <View style={[styles.marking_period_info_container]}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 30,
            paddingLeft: 20,
            paddingRight: 15,
            paddingVertical: 10,
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'center',
            marginBottom: 10
          }}
          onPress={() => onOpen('mp')}
        >
          <Text
            style={{
              fontFamily: 'Inter_800ExtraBold',
              fontSize: 35,
              marginRight: 5
            }}
          >
            {selected.name}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>
        {!isNaN(marks.gpa) && (
          <View
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
              backgroundColor: Colors.light_gray,
              marginBottom: 10
            }}
          >
            <Text style={styles.gpa}>{marks.gpa.toFixed(2)}</Text>
          </View>
        )}
      </View>
      <View style={styles.date_info_container}>
        <MaterialCommunityIcons name="calendar-clock-outline" size={18} />
        <Text style={styles.date}>
          {' \u2022'} {endDate.toLocaleDateString()}
        </Text>
      </View>
      {marks && (
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={300}
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
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16
  },
  marking_period_info_container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  date_info_container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 5
  },
  gpa: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 25
  },
  dropdown1BtnStyle: {
    backgroundColor: MD3LightTheme.colors.surfaceVariant,
    borderRadius: 30,
    borderWidth: 1,
    height: 60
  },
  dropdown1BtnTxtStyle: {
    fontSize: 30,
    fontFamily: 'Inter_800ExtraBold'
  },
  dropdown1DropdownStyle: {
    backgroundColor: MD3LightTheme.colors.surfaceVariant,
    borderRadius: 30
  },
  dropdown1RowStyle: { padding: 10 },
  dropdown1RowTxtStyle: {
    textAlign: 'left',
    fontFamily: 'Inter_500Medium',
    fontsize: 20
  }
})

export default Courses

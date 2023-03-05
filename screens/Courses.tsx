import React, { useContext, useState, useEffect, useRef } from 'react'
import AppContext from '../contexts/AppContext'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Platform
} from 'react-native'
import Course from '../components/Course'
import { convertGradebook } from '../gradebook/GradeUtil'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerForPushNotificationsAsync } from '../util/Notification'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { IconButton, useTheme, Divider } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import BannerAd from '../components/BannerAd'
import Constants from 'expo-constants'
import { palette } from '../theme/colors'
import ActionSheet, { useScrollHandlers, ActionSheetRef } from 'react-native-actions-sheet'
import { FlatList } from 'react-native-gesture-handler'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads'
import { dateRelativeToToday } from '../util/Util'

const interstitial = InterstitialAd.createForAdRequest(
  __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.OS === 'android'
    ? Constants.expoConfig.extra.COURSES_INTER_ANDROID
    : Constants.expoConfig.extra.COURSES_INTER_IOS
)

const Courses = ({ navigation }) => {
  const loaded = useRef(false)
  const course = useRef(null)
  const theme = useTheme()
  const { client, marks, setMarks } = useContext(AppContext)
  const [selected, setSelected] = useState(marks.reportingPeriod)
  const endDate = selected.date.end
  useEffect(() => {
    onRefresh()
  }, [selected])
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const scrollHandlers = useScrollHandlers<FlatList>('scroll-view1', actionSheetRef)

  useEffect(() => {
    interstitial.load()
  }, [navigation])

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      loaded.current = true
    })
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      loaded.current = false
      interstitial.load()
      navigation.navigate('Course Details', { title: course.current })
    })

    registerForPushNotificationsAsync()

    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => {
      backHandler.remove()
      unsubscribeLoaded
      unsubscribeClosed
    }
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
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? palette.neutralVariant10 : theme.colors.elevation.level1
        }
      ]}
      edges={['top', 'left', 'right']}
    >
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        indicatorStyle={{
          marginVertical: 22,
          backgroundColor: theme.colors.onSurfaceVariant
        }}
        containerStyle={{
          backgroundColor: theme.colors.surface,
          paddingBottom: Platform.OS === 'android' ? 24 : 0
        }}
      >
        <FlatList
          {...scrollHandlers}
          data={marks.reportingPeriods}
          style={{
            paddingHorizontal: 24
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelected(item)
                actionSheetRef.current?.hide()
              }}
              style={[
                { minHeight: 48, justifyContent: 'center' },
                selected.name === item.name && {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderRadius: 8,
                  marginVertical: 8,
                  padding: 12
                }
              ]}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 24,
                  color: theme.colors.onSurface
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => {
            return <Divider style={{ marginVertical: 4 }} bold />
          }}
        />
      </ActionSheet>
      <View style={styles.marking_period_info_container}>
        <TouchableOpacity
          style={[
            styles.marking_period_dropdown_button,
            { backgroundColor: theme.colors.surfaceVariant }
          ]}
          onPress={() => actionSheetRef.current?.show()}
        >
          <Text
            style={[
              styles.marking_period_dropdown_button_text,
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            {selected.name}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>
        <IconButton
          icon="refresh"
          size={40}
          onPress={onRefresh}
          mode={'contained'}
          style={{ margin: 0 }}
        />
      </View>
      <View style={styles.date_info_container}>
        {!isNaN(marks.gpa) && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.gpa_text, { color: theme.colors.onSurface }]}>GPA</Text>
            <Text style={[styles.gpa, { color: theme.colors.onSurface }]}>
              {' \u2022 '}
              {marks.gpa.toFixed(2)}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={18}
            color={theme.colors.onSurface}
          />
          <Text style={[styles.date, { color: theme.colors.onSurface }]}>
            {' \u2022 '}
            {dateRelativeToToday(endDate)}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.course_list_container,
          {
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.shadow
          }
        ]}
      >
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
          <FadeInFlatList
            initialDelay={0}
            durationPerItem={300}
            parallelItems={5}
            itemsToFadeIn={10}
            data={[...marks.courses.entries()]}
            renderItem={({ item }) => (
              <Course
                name={item[1].name}
                mark={item[1].value}
                period={item[1].period}
                teacher={item[1].teacher.name}
                onPress={() => {
                  if (loaded.current && !__DEV__) {
                    course.current = item[0]
                    interstitial.show()
                  } else {
                    navigation.navigate('Course Details', { title: item[0] })
                  }
                }}
                room={item[1].room}
              ></Course>
            )}
            keyExtractor={(item) => item[0]}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingTop: 6
            }}
          />
        )}
        <BannerAd
          androidId={Constants.expoConfig.extra.COURSES_BANNER_ANDROID}
          iosId={Constants.expoConfig.extra.COURSES_BANNER_IOS}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  marking_period_dropdown_button: {
    borderRadius: 30,
    paddingLeft: 30,
    paddingRight: 25,
    height: 56,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center'
  },
  marking_period_dropdown_button_text: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    marginRight: 5
  },
  date: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: Colors.medium_gray
  },
  marking_period_info_container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 10
  },
  date_info_container: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  gpa_text: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16
  },
  gpa: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16
  },
  course_list_container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
})

export default Courses

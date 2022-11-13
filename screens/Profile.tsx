import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  BackHandler,
  RefreshControl,
  Switch,
  Platform,
  Alert
} from 'react-native'
import { StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import {
  FontAwesome,
  Feather,
  AntDesign,
  Ionicons,
  Entypo
} from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createStackNavigator } from '@react-navigation/stack'
import SettingsScreen from './Settings/Settings'
import Setting from '../components/Setting'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { scheduleGradeCheck } from '../Notification'
import { cancelScheduledNotificationAsync } from 'expo-notifications'

const Profile = ({ navigation }) => {
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined as StudentInfo)

  const [switchOn, switchEnabled] = useState(false)
  const toggleSwitch = async () => {
    const newState = !switchOn
    switchEnabled((previousState) => !previousState)
    if (newState) await cancelScheduledNotificationAsync('GradeCheck')
    try {
      await AsyncStorage.setItem(
        'GradeCheckReminderDisabled',
        JSON.stringify(newState)
      )
    } catch (e) {
      Alert.alert('Error saving')
    }
    if (!newState) {
      scheduleGradeCheck()
    }
  }

  const [date, setDate] = useState(new Date() as Date)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = async (date: Date) => {
    hideDatePicker()
    setDate(date)
    try {
      await AsyncStorage.setItem('GradeCheckReminderDate', JSON.stringify(date))
    } catch (e) {
      Alert.alert('Error saving reminder date')
    }
    scheduleGradeCheck()
  }

  useAsyncEffect(async () => {
    onRefresh()
    try {
      const value = await AsyncStorage.getItem('GradeCheckReminderDate')
      if (value !== null) {
        setDate(new Date(JSON.parse(value)))
      }
      const enabled = await AsyncStorage.getItem('GradeCheckReminderDisabled')
      if (enabled !== null) {
        switchEnabled(JSON.parse(enabled))
      }
    } catch (e) {}

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setStudentInfo(await client.studentInfo())
    } catch (err) {}
    setRefreshing(false)
  }, [])

  if (!studentInfo) {
    return (
      <View style={{ flex: 1 }}>
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
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <Ionicons.Button
          name="exit-outline"
          size={38}
          underlayColor="none"
          activeOpacity={0.2}
          backgroundColor="transparent"
          iconStyle={{
            color: Colors.black,
            alignSelf: 'flex-end'
          }}
          style={{
            padding: 0,
            marginRight: 20
          }}
          onPress={() => {
            navigation.navigate('Login')
          }}
        />
      </View>
      <View style={styles.avatar_info_container}>
        <Image
          style={styles.avatar}
          source={{
            uri: `data:image/png;base64,${studentInfo.photo}`
          }}
        />
        <View style={styles.info_container}>
          <Text style={styles.name}>{studentInfo.student.name}</Text>
          <View style={styles.details_container}>
            <View style={styles.detaiL_container}>
              <Text style={styles.detail_value}>
                {studentInfo.grade + suffix(parseInt(studentInfo.grade))}
              </Text>
              <Text style={styles.detail_name}>Grade</Text>
            </View>
            <View style={styles.detaiL_container}>
              <Text style={styles.detail_value}>
                {studentInfo.birthDate.toLocaleDateString()}
              </Text>
              <Text style={styles.detail_name}>Birthdate</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.content_container}
      >
        <View style={styles.property_view}>
          {studentInfo.id && (
            <View style={styles.property_container}>
              <AntDesign name="idcard" size={22} color={Colors.black} />
              <Text style={styles.property_text}>{studentInfo.id}</Text>
            </View>
          )}
          {studentInfo.phone && (
            <View style={styles.property_container}>
              <Feather name="phone" size={22} color={Colors.black} />
              <Text style={styles.property_text}>{studentInfo.phone}</Text>
            </View>
          )}
          {studentInfo.email && (
            <View style={styles.property_container}>
              <Feather name="mail" size={22} color={Colors.black} />
              <Text style={styles.property_text}>{studentInfo.email}</Text>
            </View>
          )}
          {studentInfo.currentSchool && (
            <View style={styles.property_container}>
              <FontAwesome name="building-o" size={22} color={Colors.black} />
              <Text style={styles.property_text}>
                {studentInfo.currentSchool}
              </Text>
            </View>
          )}
          {studentInfo.homeRoom && (
            <View style={styles.property_container}>
              <FontAwesome
                name="pencil-square-o"
                size={22}
                color={Colors.black}
              />
              <Text style={styles.property_text}>
                Homeroom: {studentInfo.homeRoom}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.settings_title}>Settings</Text>
        <Setting
          title="Daily Grade Check Reminder"
          description="Reminds you to check your grades"
          onPress={showDatePicker}
          position="top"
        >
          <Entypo name="chevron-right" size={24} color={Colors.onyx_gray} />
        </Setting>
        <Setting title="Disable Reminder" position="bottom">
          <Switch
            trackColor={{ false: Colors.medium_gray, true: Colors.baby_blue }}
            thumbColor={switchOn ? Colors.primary : Colors.white}
            ios_backgroundColor={Colors.medium_gray}
            onValueChange={toggleSwitch}
            value={switchOn}
            style={
              Platform.OS === 'android'
                ? {
                    transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }]
                  }
                : {
                    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }]
                  }
            }
          ></Switch>
        </Setting>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontFamily: 'Montserrat_700Bold'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    borderWidth: 1,
    borderColor: Colors.black
  },
  avatar_info_container: {
    marginHorizontal: 25,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  info_container: {
    justifyContent: 'center',
    marginLeft: 20,
    flex: 1
  },
  details_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  detaiL_container: {
    alignItems: 'center'
  },
  detail_value: {
    fontSize: 20,
    fontFamily: 'Montserrat_500Medium'
  },
  detail_name: {
    fontFamily: 'Montserrat_300Light',
    fontSize: 14
  },
  content_container: {
    paddingBottom: 20
  },
  property_view: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.off_white,
    marginHorizontal: 25
  },
  property_container: {
    flexDirection: 'row',
    padding: 12
  },
  property_text: {
    marginHorizontal: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.onyx_gray
  },
  settings_title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom: 10
  }
})

const Stack = createStackNavigator()

export default function ProfileNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

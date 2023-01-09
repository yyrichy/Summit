import React, { useCallback, useContext, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Switch,
  Platform,
  Alert,
  ScrollView
} from 'react-native'
import { StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'
import { SafeAreaView } from 'react-native-safe-area-context'
import Setting from '../components/Setting'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
  cancelReminder,
  getReminderDate,
  getReminderIsDisabled,
  scheduleGradeCheck,
  setReminderDate,
  setReminderIsDisabled
} from '../util/Notification'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParams'
import { Avatar } from 'react-native-paper'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'

const Profile = () => {
  type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

  const navigation = useNavigation<loginScreenProp>()
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined as StudentInfo)

  const [switchOn, switchEnabled] = useState(false)
  const toggleSwitch = async () => {
    const newState = !switchOn
    try {
      if (newState) await cancelReminder()
    } catch (e) {
      Alert.alert('Error saving cancelling reminder')
    }
    try {
      await setReminderIsDisabled(newState)
      if (!newState) {
        await scheduleGradeCheck()
      }
    } catch (e) {
      Alert.alert('Error saving reminder preference')
    }
    switchEnabled(newState)
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
    try {
      await setReminderDate(date)
      await scheduleGradeCheck()
    } catch (e) {
      Alert.alert('Error saving reminder date')
    }
    setDate(date)
  }

  useAsyncEffect(async () => {
    onRefresh()
    setDate(await getReminderDate())
    switchEnabled(await getReminderIsDisabled())
  }, [])

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setStudentInfo(await client.studentInfo())
    } catch (err) {}
    setRefreshing(false)
  }, [])

  const downloadSchoolPicture = async () => {
    const fileName = `${studentInfo.student.name} School Picture.jpg`.replace(
      / /g,
      '_'
    )
    const filePath = FileSystem.documentDirectory + fileName
    try {
      await FileSystem.writeAsStringAsync(filePath, studentInfo.photo, {
        encoding: 'base64'
      })
      await Sharing.shareAsync(filePath)
    } catch (e) {}
  }

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
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <MaterialIcons.Button
          name="logout"
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
        <Avatar.Image
          size={120}
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
              <MaterialCommunityIcons
                name="badge-account-horizontal-outline"
                size={24}
                color={Colors.black}
              />
              <Text style={styles.property_text}>{studentInfo.id}</Text>
            </View>
          )}
          {studentInfo.phone && (
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="phone"
                size={24}
                color={Colors.black}
              />
              <Text style={styles.property_text}>{studentInfo.phone}</Text>
            </View>
          )}
          {studentInfo.email && (
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="email-outline"
                size={24}
                color={Colors.black}
              />
              <Text style={styles.property_text}>{studentInfo.email}</Text>
            </View>
          )}
          {studentInfo.currentSchool && (
            <View style={styles.property_container}>
              <MaterialIcons
                name="location-pin"
                size={24}
                color={Colors.black}
              />
              <Text style={styles.property_text}>
                {studentInfo.currentSchool}
              </Text>
            </View>
          )}
          {studentInfo.homeRoom && (
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="account-box-outline"
                size={24}
                color={Colors.black}
              />
              <Text style={styles.property_text}>
                Homeroom: {studentInfo.homeRoom}
              </Text>
            </View>
          )}
        </View>
        <Setting
          title="Download School Picture"
          onPress={downloadSchoolPicture}
          position="single"
        >
          <MaterialCommunityIcons
            name="download"
            size={24}
            color={Colors.black}
          />
        </Setting>
        <Text style={styles.settings_title}>Settings</Text>
        <Setting
          title="Daily Grade Check Reminder"
          description="Reminds you to check your grades"
          onPress={showDatePicker}
          position="top"
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={Colors.black}
          />
        </Setting>
        <Seperator />
        <Setting title="Disable Reminder" position="middle">
          <Switch
            trackColor={{ false: Colors.medium_gray, true: Colors.navy }}
            thumbColor={switchOn ? Colors.primary : Colors.white}
            ios_backgroundColor={Colors.medium_gray}
            onValueChange={toggleSwitch}
            value={switchOn}
            style={
              Platform.OS === 'android'
                ? {
                    transform: [{ scale: 1.25 }]
                  }
                : {
                    transform: [{ scale: 0.75 }]
                  }
            }
          ></Switch>
        </Setting>
        <Seperator />
        <Setting
          title="Clear Login Info"
          description="Deletes saved username, password, and district from your phone"
          onPress={() => deleteLoginInfo()}
          position="bottom"
        ></Setting>
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
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginHorizontal: 25,
    marginBottom: 15
  },
  property_container: {
    flexDirection: 'row',
    padding: 12
  },
  property_text: {
    marginLeft: 12,
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

const Seperator = () => {
  return (
    <View
      style={{
        height: 4
      }}
    ></View>
  )
}

const deleteLoginInfo = async () => {
  try {
    await SecureStore.deleteItemAsync('username')
    await SecureStore.deleteItemAsync('password')
    await SecureStore.deleteItemAsync('district')
  } catch (e) {
    Alert.alert('Error deleting login info')
    return
  }
  Alert.alert('Login info successfully deleted')
}

export default Profile

import React, { useContext, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView
} from 'react-native'
import { StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
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
import { Avatar, Divider, IconButton, useTheme } from 'react-native-paper'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { getOrdinal, toast } from '../util/Util'
import { Switch } from '../components/switch/Switch'

const Profile = () => {
  type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>
  const theme = useTheme()

  const navigation = useNavigation<loginScreenProp>()
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(null as StudentInfo)

  const [switchOn, switchEnabled] = useState(false)
  const [defaultSwitchOn, setDefaultSwitchEnabled] = useState(null as boolean)
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
    try {
      setDefaultSwitchEnabled(await getReminderIsDisabled())
      setDate(await getReminderDate())
      setStudentInfo(await client.studentInfo())
    } catch (err) {}
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
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 4,
          zIndex: 1
        }}
      >
        <IconButton
          icon={({ color, size }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          )}
          onPress={() => navigation.navigate('Login')}
          mode="contained"
          style={{
            padding: 0,
            margin: 0
          }}
        />
      </View>
      <View style={styles.avatar_info_container}>
        <Avatar.Image
          size={100}
          source={{
            uri: `data:image/png;base64,${studentInfo.photo}`
          }}
        />
        <View style={styles.info_container}>
          <Text numberOfLines={2} style={styles.name}>
            {studentInfo.student.name}
          </Text>
          {studentInfo.currentSchool && (
            <Text style={styles.school}>{studentInfo.currentSchool}</Text>
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
      >
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 5
          }}
        >
          <IconPropertyBox
            icon={
              <MaterialCommunityIcons
                name="school-outline"
                size={24}
                color={Colors.black}
              />
            }
            text={studentInfo.grade + getOrdinal(parseInt(studentInfo.grade))}
            backgroundColor={theme.colors.elevation.level1}
          />
          <IconPropertyBox
            icon={
              <MaterialCommunityIcons
                name="cake-variant-outline"
                size={24}
                color={Colors.black}
              />
            }
            text={studentInfo.birthDate.toLocaleDateString()}
            backgroundColor={theme.colors.elevation.level1}
          />
          <IconPropertyBox
            icon={
              <MaterialCommunityIcons
                name="badge-account-horizontal-outline"
                size={24}
                color={Colors.black}
              />
            }
            text={studentInfo.id}
            backgroundColor={theme.colors.elevation.level1}
          />
        </View>
        <View style={styles.property_view}>
          {studentInfo.phone && (
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="phone"
                size={20}
                color={Colors.secondary}
              />
              <Text style={styles.property_text}>{studentInfo.phone}</Text>
            </View>
          )}
          <Divider horizontalInset />
          {studentInfo.address && (
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="home-outline"
                size={20}
                color={Colors.secondary}
              />
              <Text style={styles.property_text}>
                {studentInfo.address.replace(/&lt;br&gt;/g, ' ')}
              </Text>
            </View>
          )}
          <Divider horizontalInset />
          {studentInfo.email && (
            <View style={styles.property_container}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={Colors.secondary}
              />
              <Text style={styles.property_text}>{studentInfo.email}</Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.settings_container,
            {
              backgroundColor: theme.colors.elevation.level1,
              shadowColor: theme.colors.shadow
            }
          ]}
        >
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
            title="Daily Reminder"
            description="Notifies you to check your grades at a certain time everyday"
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
              onChange={toggleSwitch}
              defaultChecked={defaultSwitchOn}
            ></Switch>
          </Setting>
          <Seperator />
          <Setting
            title="Delete Login Info"
            onPress={deleteLoginInfo}
            position="bottom"
            description="Deletes saved username and password from device"
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={24}
              color={Colors.black}
            />
          </Setting>
        </View>
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

const IconPropertyBox = ({ icon, text, backgroundColor }) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 20,
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 5
      }}
    >
      {icon}
      <Text
        numberOfLines={1}
        style={{ fontFamily: 'Inter_500Medium', fontSize: 12 }}
      >
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold'
  },
  school: {
    fontSize: 14,
    fontFamily: 'Inter_300Light',
    marginTop: 2
  },
  avatar_info_container: {
    marginHorizontal: 25,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: -20
  },
  info_container: {
    justifyContent: 'center',
    marginLeft: 20,
    flex: 1
  },
  property_view: {
    marginHorizontal: 30,
    marginBottom: 10
  },
  property_container: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  property_text: {
    marginLeft: 20,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.medium_gray
  },
  settings_title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    marginTop: 15,
    marginBottom: 10
  },
  settings_container: {
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    shadowOffset: {
      width: 0,
      height: -4
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 5
  }
})

const Seperator = () => {
  return (
    <View
      style={{
        height: 4
      }}
    />
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
  toast('Login info successfully deleted')
}

export default Profile

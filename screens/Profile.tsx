import React, { useCallback, useContext, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  BackHandler,
  SafeAreaView,
  RefreshControl
} from 'react-native'
import { SchoolInfo, StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  AntDesign
} from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'
import { ScrollView } from 'react-native-gesture-handler'

const Profile = ({ navigation }) => {
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined as StudentInfo)
  const [schoolInfo, setSchoolInfo] = useState(undefined as SchoolInfo)

  useAsyncEffect(async () => {
    setStudentInfo(await client.studentInfo())
    setSchoolInfo(await client.schoolInfo())

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
      setSchoolInfo(await client.schoolInfo())
    } catch (err) {}
    setRefreshing(false)
  }, [])

  if (!studentInfo || !schoolInfo) {
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
        style={styles.property_view}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.property_view_content_container}
      >
        {studentInfo.id && (
          <View style={styles.property_container}>
            <AntDesign name="idcard" size={22} color={Colors.black} />
            <Text style={styles.property_text}>
              {studentInfo.id ? studentInfo.id : ''}
            </Text>
          </View>
        )}
        {studentInfo.phone && (
          <View style={styles.property_container}>
            <Feather name="phone" size={22} color={Colors.black} />
            <Text style={styles.property_text}>{studentInfo.phone}</Text>
          </View>
        )}
        {studentInfo.address && (
          <View style={styles.property_container}>
            <Feather name="home" size={22} color={Colors.black} />
            <Text style={styles.property_text}>{studentInfo.address}</Text>
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
        {schoolInfo.school.address && (
          <View style={styles.property_container}>
            <Feather name="map-pin" size={22} color={Colors.black} />
            <Text style={styles.property_text}>
              {schoolInfo.school.address}
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
        {studentInfo.counselor && (
          <View style={styles.property_container}>
            <Feather name="user" size={22} color={Colors.black} />
            <Text style={styles.property_text}>
              Counselor: {studentInfo.counselor.email}
            </Text>
          </View>
        )}
        {schoolInfo.school.principal && (
          <View style={styles.property_container}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={22}
              color={Colors.black}
            />
            <Text style={styles.property_text}>
              Principal: {schoolInfo.school.principal.email}
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginTop: 15,
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
  property_view: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.off_white,
    marginHorizontal: 25,
    marginBottom: 7
  },
  property_view_content_container: {
    flexGrow: 1,
    padding: 10
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
  }
})

export default Profile

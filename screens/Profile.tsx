import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, View, Text } from 'react-native'
import { SchoolInfo, StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import { FontAwesome } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'
import { ScrollView } from 'react-native-gesture-handler'

const Profile = () => {
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined as StudentInfo)
  const [schoolInfo, setSchoolInfo] = useState(undefined as SchoolInfo)

  useAsyncEffect(async () => {
    setStudentInfo(await client.studentInfo())
    setSchoolInfo(await client.schoolInfo())
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {!studentInfo || !schoolInfo ? (
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
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}></View>
          <Image
            style={styles.avatar}
            source={{
              uri: `data:image/png;base64,${studentInfo.photo}`
            }}
          />
          <Text style={styles.name}>{studentInfo.student.name}</Text>
          <View style={styles.description_container}>
            <Text style={styles.description_part_text}>
              {studentInfo.grade + suffix(parseInt(studentInfo.grade))}
            </Text>
            <Text style={styles.description_part_text}>
              {studentInfo.birthDate.toLocaleDateString()}
            </Text>
          </View>
          <ScrollView style={styles.property_view}>
            {studentInfo.id && (
              <View style={styles.property_container}>
                <AntDesign name="idcard" size={26} color={Colors.black} />
                <Text style={styles.property_text}>
                  {studentInfo.id ? studentInfo.id : ''}
                </Text>
              </View>
            )}
            {studentInfo.phone && (
              <View style={styles.property_container}>
                <Feather name="phone" size={26} color={Colors.black} />
                <Text style={styles.property_text}>{studentInfo.phone}</Text>
              </View>
            )}
            {studentInfo.address && (
              <View style={styles.property_container}>
                <Feather name="home" size={26} color={Colors.black} />
                <Text style={styles.property_text}>{studentInfo.address}</Text>
              </View>
            )}
            {studentInfo.email && (
              <View style={styles.property_container}>
                <Feather name="mail" size={26} color={Colors.black} />
                <Text style={styles.property_text}>{studentInfo.email}</Text>
              </View>
            )}
            {studentInfo.currentSchool && (
              <View style={styles.property_container}>
                <FontAwesome name="building-o" size={26} color={Colors.black} />
                <Text style={styles.property_text}>
                  {studentInfo.currentSchool}
                </Text>
              </View>
            )}
            {schoolInfo.school.address && (
              <View style={styles.property_container}>
                <Feather name="map-pin" size={26} color={Colors.black} />
                <Text style={styles.property_text}>
                  {schoolInfo.school.address}
                </Text>
              </View>
            )}
            {studentInfo.homeRoom && (
              <View style={styles.property_container}>
                <FontAwesome
                  name="pencil-square-o"
                  size={26}
                  color={Colors.black}
                />
                <Text style={styles.property_text}>
                  Homeroom: {studentInfo.homeRoom}
                </Text>
              </View>
            )}
            {studentInfo.counselor && (
              <View style={styles.property_container}>
                <Feather name="user" size={26} color={Colors.black} />
                <Text style={styles.property_text}>
                  Counselor: {studentInfo.counselor.name}{' '}
                  {studentInfo.counselor.email}
                </Text>
              </View>
            )}
            {schoolInfo.school.principal && (
              <View style={styles.property_container}>
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={26}
                  color={Colors.black}
                />
                <Text style={styles.property_text}>
                  Principal: {schoolInfo.school.principal.name}{' '}
                  {schoolInfo.school.principal.email}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6
  },
  name: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold',
    alignSelf: 'center',
    margin: 5
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 1,
    borderColor: Colors.black,
    alignSelf: 'center',
    marginTop: -150 / 2
  },
  description_container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  description_part_text: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold'
  },
  property_view: {
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.secondary,
    backgroundColor: Colors.off_white,
    padding: 10,
    paddingBottom: 0,
    marginHorizontal: 20,
    flexGrow: 0
  },
  property_container: {
    flexDirection: 'row',
    padding: 12
  },
  property_text: {
    marginHorizontal: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: Colors.onyx_gray
  }
})

export default Profile

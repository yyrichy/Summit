import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, View, Text } from 'react-native'
import { StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import { FontAwesome } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'
import { ScrollView } from 'react-native-gesture-handler'

const Profile = () => {
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined as StudentInfo)

  useAsyncEffect(async () => {
    setStudentInfo(await client.studentInfo())
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {!studentInfo ? (
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
            <View style={styles.description_part_container}>
              <Text style={styles.description_part_text}>
                {studentInfo.grade + suffix(parseInt(studentInfo.grade))}
              </Text>
            </View>
            <View style={styles.description_part_container}>
              <Text style={styles.description_part_text}>
                {studentInfo.birthDate.getMonth() + 1}/
                {studentInfo.birthDate.getDate()}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.property_view}>
            <View style={styles.property_container}>
              <AntDesign name="idcard" size={26} color={Colors.black} />
              <Text style={styles.property_text}>
                {studentInfo.id ? `#${studentInfo.id}` : ''}
              </Text>
            </View>
            <View style={styles.property_container}>
              <Feather name="phone" size={26} color={Colors.black} />
              <Text style={styles.property_text}>{studentInfo.phone}</Text>
            </View>
            <View style={styles.property_container}>
              <Feather name="mail" size={26} color={Colors.black} />
              <Text style={styles.property_text}>{studentInfo.email}</Text>
            </View>
            <View style={styles.property_container}>
              <Feather name="map-pin" size={26} color={Colors.black} />
              <Text style={styles.property_text}>{studentInfo.address}</Text>
            </View>
            <View style={styles.property_container}>
              <FontAwesome name="building-o" size={26} color={Colors.black} />
              <Text style={styles.property_text}>
                {studentInfo.currentSchool}
              </Text>
            </View>
            <View style={styles.property_container}>
              <Feather name="home" size={26} color={Colors.black} />
              <Text style={styles.property_text}>
                {studentInfo.homeRoom ? `Room ${studentInfo.homeRoom}` : ''}
              </Text>
            </View>
            <View style={styles.property_container}>
              <Feather name="user" size={26} color={Colors.black} />
              <Text style={styles.property_text}>
                {studentInfo.counselor
                  ? `Counselor: ${studentInfo.counselor.name}`
                  : ''}
              </Text>
            </View>
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
    shadowRadius: 5
  },
  name: {
    fontSize: 30,
    fontFamily: 'Montserrat_700Bold',
    alignSelf: 'center',
    margin: 5
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 0,
    borderColor: 'white',
    alignSelf: 'center',
    marginTop: -150 / 2
  },
  description_container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  description_part_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  description_part_text: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold'
  },
  property_view: {
    flex: 1,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.secondary,
    backgroundColor: Colors.off_white,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20
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

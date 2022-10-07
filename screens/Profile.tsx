import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, View, Text } from 'react-native'
import { StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import { FontAwesome } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'

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
        <View>
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
              <FontAwesome
                name="graduation-cap"
                size={18}
                color={Colors.black}
              />
            </View>
            <View style={styles.description_part_container}>
              <Text style={styles.description_part_text}>
                {studentInfo.birthDate.toLocaleDateString()}
              </Text>
              <FontAwesome
                name="birthday-cake"
                size={18}
                color={Colors.black}
              />
            </View>
          </View>
          <View style={styles.property_container}>
            <AntDesign name="idcard" size={26} color={Colors.black} />
            <Text style={styles.property_text}>
              {studentInfo.id ? `#${studentInfo.id}` : ''}
            </Text>
          </View>
          <View style={styles.property_container}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={26}
              color={Colors.black}
            />
            <Text style={styles.property_text}>{studentInfo.gender}</Text>
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
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: Colors.primary
  },
  name: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    alignSelf: 'center',
    marginTop: 10
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    borderWidth: 4,
    borderColor: 'white',
    alignSelf: 'center',
    marginTop: -130 / 2
  },
  description_container: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: Colors.secondary,
    borderWidth: 1
  },
  description_part_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  description_part_text: {
    marginTop: 5,
    fontSize: 22,
    fontFamily: 'Montserrat_800ExtraBold'
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

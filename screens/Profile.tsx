import React, { useContext, useState } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'

const Profile = () => {
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined)

  const fetchStudentInfo = async () => {
    setStudentInfo(await client.studentInfo())
  }
  if (!studentInfo) fetchStudentInfo()

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <Text>Student info defined and shown here</Text>
      )}
    </SafeAreaView>
  )
}

export default Profile

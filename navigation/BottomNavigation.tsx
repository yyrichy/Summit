import * as React from 'react'
import { BottomNavigation } from 'react-native-paper'
import CalendarScreen from '../screens/Calendar'
import Documents from '../screens/Documents'
import Profile from '../screens/Profile'
import Grades from '../screens/Grades'
import { Colors } from '../colors/Colors'
import { Text, View } from 'react-native'
import ScheduleScreen from '../screens/Schedule'

const App = () => {
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    {
      key: 'grades',
      title: 'Grades',
      focusedIcon: 'chart-box',
      unfocusedIcon: 'chart-box-outline'
    },
    {
      key: 'documents',
      title: 'Documents',
      focusedIcon: 'folder',
      unfocusedIcon: 'folder-outline'
    },
    {
      key: 'schedule',
      title: 'Schedule',
      focusedIcon: 'view-list',
      unfocusedIcon: 'view-list-outline'
    },
    {
      key: 'calendar',
      title: 'Calendar',
      focusedIcon: 'calendar-blank',
      unfocusedIcon: 'calendar-blank-outline'
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline'
    }
  ])

  const renderScene = BottomNavigation.SceneMap({
    grades: Grades,
    documents: Documents,
    schedule: ScheduleScreen,
    calendar: CalendarScreen,
    profile: Profile
  })

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            color: Colors.navy,
            fontFamily: 'Inter_400Regular',
            fontSize: 12
          }}
        >
          {route.title}
        </Text>
      </View>
    )
  }

  return (
    <BottomNavigation
      shifting={false}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderLabel={renderLabel}
      activeColor={Colors.navy}
      inactiveColor={Colors.medium_gray}
      barStyle={{
        backgroundColor: Colors.primary
      }}
    />
  )
}

export default App

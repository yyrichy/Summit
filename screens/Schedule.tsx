import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator
} from 'react-native'
import { Colors } from '../colors/Colors'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { Schedule } from 'studentvue'
import ScheduleComponent from '../components/Schedule'

const ScheduleScreen = () => {
  const { client } = useContext(AppContext)
  const [schedule, setSchedule] = useState(null as Schedule)

  useEffect(() => {
    onRefresh()
  }, [])

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      setSchedule(await client.schedule())
    } catch (err) {
      console.log(err)
    }
    setRefreshing(false)
  }
  if (!schedule)
    return (
      <View>
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

  if (!schedule.today[0])
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={styles.title_container}>
          <Text style={styles.title}>Schedule</Text>
          <Text>No schedule for today</Text>
        </View>
      </SafeAreaView>
    )

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={styles.title_container}>
        <Text style={styles.title}>{schedule.today[0].name}</Text>
        <Text>{schedule.today[0].bellScheduleName}</Text>
      </View>
      <FadeInFlatList
        initialDelay={0}
        durationPerItem={500}
        parallelItems={5}
        itemsToFadeIn={schedule.today[0].classes.length}
        data={schedule.today[0].classes}
        renderItem={({ item }) => (
          <ScheduleComponent
            name={item.name}
            period={item.period}
            teacher={item.teacher.name}
            start={item.time.start}
            end={item.time.end}
          ></ScheduleComponent>
        )}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: 7
        }}
        ItemSeparatorComponent={Seperator}
      />
    </SafeAreaView>
  )
}

const Seperator = () => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: Colors.secondary,
        marginHorizontal: 12,
        marginVertical: 8
      }}
    ></View>
  )
}

const styles = StyleSheet.create({
  title_container: {
    paddingHorizontal: 11,
    marginBottom: 8
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30
  },
  bell_schedule: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    marginTop: 8
  },
  refresh_button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default ScheduleScreen

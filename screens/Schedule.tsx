import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import { Colors } from '../colors/Colors'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { Schedule } from 'studentvue'
import ScheduleComponent from '../components/Schedule'
import { SegmentedButtons } from 'react-native-paper'
import useAsyncEffect from 'use-async-effect'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'

const ScheduleScreen = () => {
  const { client } = useContext(AppContext)
  const [schedule, setSchedule] = useState(null as Schedule)
  const [refreshing, setRefreshing] = useState(false)
  const [value, setValue] = React.useState('today' as string)
  const [buttons, setButtons] = React.useState([])

  useAsyncEffect(async () => {
    const schedule = await client.schedule()
    const b = [{ value: 'today', label: 'Today' }]
    for (const t of schedule.terms) {
      b.push({ value: t.index.toString(), label: t.name })
    }
    setButtons(b)

    onRefresh()
  }, [])

  useEffect(() => {
    onRefresh()
  }, [value])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      if (value === 'today') {
        setSchedule(await client.schedule())
      } else {
        setSchedule(await client.schedule(parseInt(value)))
      }
    } catch (err) {}
    setRefreshing(false)
  }

  const TermButtons = () => {
    return (
      <View style={{ height: 50 }}>
        <MaskedView
          style={{ flexShrink: 1 }}
          maskElement={
            <LinearGradient
              style={{ flexGrow: 1 }}
              colors={[
                Colors.transparent,
                Colors.white,
                Colors.white,
                Colors.transparent
              ]}
              locations={[0.0, 0.2, 0.8, 1]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            />
          }
        >
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1
            }}
            showsHorizontalScrollIndicator={false}
          >
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              style={{ marginBottom: 8 }}
              buttons={buttons}
            />
          </ScrollView>
        </MaskedView>
      </View>
    )
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

  if (value === 'today') {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={styles.title_container}>
          <Text style={styles.title}>
            {schedule.today[0] ? schedule.today[0].name : 'Schedule'}
          </Text>
          <Text>
            {schedule.term.name} -{' '}
            {schedule.today[0] ? schedule.today[0].bellScheduleName : 'Today'}
          </Text>
        </View>
        <TermButtons />
        {schedule.today[0] ? (
          <FadeInFlatList
            initialDelay={0}
            durationPerItem={350}
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
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: 7,
              flexGrow: 0
            }}
            ItemSeparatorComponent={Seperator}
          />
        ) : (
          <View style={styles.schedule_error_container}>
            <Text style={styles.schedule_error_text}>
              No schedule available for today
            </Text>
          </View>
        )}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={styles.title_container}>
        <Text style={styles.title}>
          {schedule.today[0] ? schedule.today[0].name : 'Schedule'}
        </Text>
        <Text>{schedule.term.name}</Text>
      </View>
      <TermButtons />
      {schedule.classes.length > 0 ? (
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={350}
          parallelItems={5}
          itemsToFadeIn={schedule.classes.length}
          data={schedule.classes}
          renderItem={({ item }) => (
            <ScheduleComponent
              name={item.name}
              period={item.period}
              teacher={item.teacher.name}
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
      ) : (
        <View style={styles.schedule_error_container}>
          <Text style={styles.schedule_error_text}>{schedule.error}</Text>
        </View>
      )}
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
  },
  schedule_error_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  schedule_error_text: {
    fontFamily: 'Inter_400Regular'
  }
})

export default ScheduleScreen

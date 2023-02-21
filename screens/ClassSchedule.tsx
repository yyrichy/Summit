import React, { useContext, useEffect, useState } from 'react'
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
import { Divider, SegmentedButtons, useTheme } from 'react-native-paper'
import useAsyncEffect from 'use-async-effect'

const ScheduleScreen = () => {
  const theme = useTheme()
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
      <View style={{ height: 50, marginBottom: 8 }}>
        <ScrollView
          horizontal
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            paddingHorizontal: 10
          }}
          showsHorizontalScrollIndicator={false}
        >
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={buttons}
          />
        </ScrollView>
      </View>
    )
  }

  if (!schedule)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
      <View style={{ flex: 1 }}>
        <View style={styles.title_container}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {schedule.today[0] ? schedule.today[0].name : 'Schedule'}
          </Text>
          <Text style={[styles.term_name, { color: theme.colors.onSurface }]}>
            {schedule.term.name} -{' '}
            {schedule.today[0] ? schedule.today[0].bellScheduleName : 'Today'}
          </Text>
        </View>
        <TermButtons />
        {schedule.today[0] ? (
          <FadeInFlatList
            initialDelay={0}
            durationPerItem={300}
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
              paddingHorizontal: 10,
              flexGrow: 1
            }}
            ItemSeparatorComponent={Seperator}
          />
        ) : (
          <View style={styles.schedule_error_container}>
            <Text
              style={[
                styles.schedule_error_text,
                { color: theme.colors.onSurface }
              ]}
            >
              No schedule available for today
            </Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.title_container}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {schedule.today[0] ? schedule.today[0].name : 'Schedule'}
        </Text>
        <Text style={[styles.term_name, { color: theme.colors.onSurface }]}>
          {schedule.term.name}
        </Text>
      </View>
      <TermButtons />
      {schedule.classes.length > 0 ? (
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={300}
          parallelItems={5}
          itemsToFadeIn={schedule.classes.length}
          data={schedule.classes}
          renderItem={({ item }) => (
            <ScheduleComponent
              name={item.name}
              period={item.period}
              teacher={item.teacher.name}
              room={item.room}
            ></ScheduleComponent>
          )}
          keyExtractor={(item) => item.name}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingHorizontal: 10,
            flexGrow: 1
          }}
          ItemSeparatorComponent={Seperator}
        />
      ) : (
        <View style={styles.schedule_error_container}>
          <Text
            style={[
              styles.schedule_error_text,
              { color: theme.colors.onSurface }
            ]}
          >
            {schedule.error}
          </Text>
        </View>
      )}
    </View>
  )
}

const Seperator = () => {
  return (
    <Divider
      style={{
        marginHorizontal: 12,
        marginVertical: 8
      }}
      horizontalInset
      bold
    />
  )
}

const styles = StyleSheet.create({
  title_container: {
    marginVertical: 5,
    paddingHorizontal: 10
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24
  },
  term_name: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14
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

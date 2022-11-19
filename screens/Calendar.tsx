import React, { useContext, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import { Agenda, AgendaSchedule } from 'react-native-calendars'
import useAsyncEffect from 'use-async-effect'
import Item from '../components/Item'
import { Colors } from '../colors/Colors'

const CalendarScreen = ({ navigation }) => {
  const { client } = useContext(AppContext)
  const [items, setItems] = useState(undefined as AgendaSchedule)

  useAsyncEffect(async () => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    try {
      const calendar = await client.calendar()
      const start =
        calendar.schoolDate.start instanceof Date
          ? calendar.schoolDate.start
          : new Date(calendar.schoolDate.start)
      const end =
        calendar.schoolDate.end instanceof Date
          ? calendar.schoolDate.end
          : new Date(calendar.schoolDate.end)

      const fullCalendar = await client.calendar({
        interval: {
          start: start,
          end: end
        }
      })

      const currentItems = {}
      for (const date of getDatesFromDateRange(start, end)) {
        currentItems[toTimeString(date)] = []
      }
      for (const event of fullCalendar.events) {
        const dateString = toTimeString(event.date)
        currentItems[dateString].push({
          event: event,
          day: dateString
        })
      }
      const newItems = {}
      Object.keys(currentItems).forEach((key) => {
        newItems[key] = currentItems[key]
      })
      setItems(newItems)
    } catch (err) {}

    return () => backHandler.remove()
  }, [])

  const getDatesFromDateRange = (from: Date, to: Date): Date[] => {
    const dates = []
    for (let date = from; date < to; date.setDate(date.getDate() + 1)) {
      const cloned = new Date(date.valueOf())
      dates.push(cloned)
    }
    dates.push(to)
    return dates
  }

  const renderItem = (item) => {
    return <Item item={item}></Item>
  }

  const toTimeString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={styles.row_container}>
        <View style={styles.title_container}>
          <Text style={styles.title}>Calendar</Text>
        </View>
      </View>
      {items ? (
        <Agenda
          items={items}
          renderItem={(item) => renderItem(item)}
          minDate={Object.keys(items)[0]}
          maxDate={Object.keys(items)[Object.keys(items).length - 1]}
          removeClippedSubviews
        />
      ) : (
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
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  row_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '75%'
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    marginHorizontal: 11
  },
  refresh_button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  item_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
})

export default CalendarScreen

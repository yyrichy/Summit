import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import { Calendar } from 'studentvue'
import { Agenda, AgendaEntry, DateData } from 'react-native-calendars'
import useAsyncEffect from 'use-async-effect'
import { prependZero } from '../gradebook/GradeUtil'
import Item from '../components/Item'

const CalendarScreen = ({ navigation }) => {
  const { client } = useContext(AppContext)
  const [calendar, setCalendar] = useState(undefined as Calendar)
  const [items, setItems] = useState({})
  const [startDate, setStartDate] = useState(undefined as string)
  const [endDate, setEndDate] = useState(undefined as string)
  const [monthsLoaded, setMonthsLoaded] = useState([] as string[])

  useAsyncEffect(async () => {
    try {
      setCalendar(await client.calendar())
    } catch (err) {}

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

  useEffect(() => {
    if (calendar) {
      const start = calendar.schoolDate.start
      if (start instanceof Date) {
        setStartDate(
          `${start.getFullYear()}-${prependZero(
            start.getMonth() + 1
          )}-${start.getDate()}`
        )
      }
      const end = calendar.schoolDate.end
      if (end instanceof Date) {
        setEndDate(
          `${end.getFullYear()}-${prependZero(
            end.getMonth() + 1
          )}-${end.getDate()}`
        )
      }
    }
  }, [calendar])

  const loadItems = async (day: DateData) => {
    const months: string[] = monthsLoaded
    if (months.some((m) => m === `${day.month} ${day.year}`)) {
      return
    }
    const startOfMonth = new Date(day.year, day.month, 1)
    const endOfMonth = new Date(day.year, day.month + 1, 0)
    const currentItems: {} = items
    for (const date of getDatesFromDateRange(startOfMonth, endOfMonth)) {
      currentItems[date.toISOString().split('T')[0]] = []
    }
    const monthCalendar = await client.calendar({
      interval: {
        start: startOfMonth,
        end: endOfMonth
      }
    })
    for (const event of monthCalendar.events) {
      const dateString = event.date.toISOString().split('T')[0]
      currentItems[dateString] = []
      currentItems[dateString].push({
        name: `${event.startTime && `${event.startTime} - `}${event.title}`
      })
    }
    const newItems = {}
    Object.keys(currentItems).forEach((key) => {
      newItems[key] = currentItems[key]
    })
    setItems(newItems)
    months.push(`${day.month} ${day.year}`)
    setMonthsLoaded(months)
  }

  function getDatesFromDateRange(from: Date, to: Date): Date[] {
    const dates = []
    for (let date = from; date < to; date.setDate(date.getDate() + 1)) {
      const cloned = new Date(date.valueOf())
      dates.push(cloned)
    }
    dates.push(to)
    return dates
  }

  function renderItem(item: AgendaEntry) {
    return <Item item={item}></Item>
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={styles.row_container}>
        <View style={styles.title_container}>
          <Text style={styles.title}>Calendar</Text>
        </View>
      </View>
      <Agenda
        items={items}
        loadItemsForMonth={(data) => loadItems(data)}
        renderItem={(item) => renderItem(item)}
        minDate={startDate}
        maxDate={endDate}
        removeClippedSubviews
      />
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

import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../contexts/AppContext'
import { Agenda, AgendaSchedule } from 'react-native-calendars'
import useAsyncEffect from 'use-async-effect'
import Item from '../components/Item'
import { useTheme } from 'react-native-paper'
import { palette } from '../theme/colors'
import { Colors } from '../colors/Colors'

const CalendarScreen = () => {
  const { client } = useContext(AppContext)
  const [items, setItems] = useState(null as AgendaSchedule)
  const theme = useTheme()
  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey(Math.random())
  }, [theme])

  useAsyncEffect(async () => {
    try {
      const calendar = await client.calendar()
      const start = new Date(calendar.outputRange.start)
      const end = new Date(calendar.outputRange.end)

      const currentItems = {}
      for (const date of getDatesFromDateRange(start, end)) {
        currentItems[toCalendarTimeString(date)] = []
      }

      for (const event of calendar.events) {
        const dateString = toCalendarTimeString(event.date)
        currentItems[dateString].push({
          event: event,
          day: dateString
        })
      }
      setItems(currentItems)
    } catch (err) {}
  }, [])

  return (
    <Agenda
      key={key}
      items={items}
      renderItem={(item) => renderItem(item)}
      minDate={items && Object.keys(items)[0]}
      maxDate={items && Object.keys(items)[Object.keys(items).length - 1]}
      removeClippedSubviews
      theme={{
        calendarBackground: theme.dark ? palette.neutralVariant10 : theme.colors.elevation.level1,
        monthTextColor: theme.colors.onSurfaceVariant,
        dotColor: Colors.accent,
        dayTextColor: theme.dark ? Colors.white : Colors.black,
        agendaDayTextColor: theme.colors.onSurfaceVariant,
        agendaDayNumColor: theme.colors.onSurface,
        textDisabledColor: Colors.secondary,
        agendaTodayColor: theme.colors.tertiary,
        agendaKnobColor: theme.dark ? 'white' : 'black',
        selectedDayBackgroundColor: theme.colors.primary,
        selectedDayTextColor: theme.colors.onPrimary,
        todayBackgroundColor: theme.colors.tertiary,
        todayTextColor: theme.colors.onTertiary,
        //@ts-ignore
        'stylesheet.agenda.main': {
          reservations: {
            backgroundColor: theme.colors.surface,
            flex: 1,
            marginTop: 100
          }
        }
      }}
    />
  )
}

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

const toCalendarTimeString = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export default CalendarScreen

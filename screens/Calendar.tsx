import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, View, Text, Animated, Easing } from 'react-native'
import AppContext from '../contexts/AppContext'
import { Agenda, AgendaSchedule } from 'react-native-calendars'
import useAsyncEffect from 'use-async-effect'
import Item from '../components/Item'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '../colors/Colors'
import { useTheme } from 'react-native-paper'

const CalendarScreen = () => {
  const { client } = useContext(AppContext)
  const [items, setItems] = useState(null as AgendaSchedule)
  const theme = useTheme()

  const lowestScale = 0.4
  const scaleAnim = useRef(new Animated.Value(lowestScale)).current

  useAsyncEffect(async () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.elastic(1),
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: lowestScale,
          duration: 750,
          easing: Easing.back(1),
          useNativeDriver: true
        })
      ])
    ).start()

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
    <View style={{ flex: 1 }}>
      {items ? (
        <Agenda
          items={items}
          renderItem={(item) => renderItem(item)}
          minDate={Object.keys(items)[0]}
          maxDate={Object.keys(items)[Object.keys(items).length - 1]}
          removeClippedSubviews
        />
      ) : (
        <Animated.View
          style={[
            styles.scale_container,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Animated.View style={[styles.fadingContainer]}>
            <MaterialCommunityIcons
              name="calendar"
              size={50}
              color={theme.colors.onSurface}
            />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  scale_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fadingContainer: {
    position: 'absolute'
  }
})

export default CalendarScreen

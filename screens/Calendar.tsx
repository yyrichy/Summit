import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, View, Text, Animated, Easing } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import { Agenda, AgendaSchedule } from 'react-native-calendars'
import useAsyncEffect from 'use-async-effect'
import Item from '../components/Item'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const CalendarScreen = () => {
  const { client } = useContext(AppContext)
  const [items, setItems] = useState(undefined as AgendaSchedule)

  const lowestScale = 0.4
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fadeAnim2 = useRef(new Animated.Value(1)).current
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
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start()
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim2, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 1500,
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
        <Animated.View
          style={[
            styles.scale_container,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Animated.View
            style={[
              styles.fadingContainer,
              {
                opacity: fadeAnim
              }
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-blank"
              size={50}
              color="black"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.fadingContainer,
              {
                opacity: fadeAnim2
              }
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={50}
              color="black"
            />
          </Animated.View>
        </Animated.View>
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
  },
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

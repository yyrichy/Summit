import React from 'react'
import { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Event, EventType } from 'studentvue'

type Props = {
  item: { event: Event; day: string }
}

const Item: React.FC<Props> = ({ item: { event } }) => {
  switch (event.type.toString()) {
    case EventType.ASSIGNMENT:
      return (
        <View style={styles.item}>
          <Text style={styles.item_text}>{event.title}</Text>
        </View>
      )
    case EventType.HOLIDAY:
      return (
        <View style={styles.item}>
          <Text style={styles.time_text}>
            HOLIDAY{event.startTime.length !== 0 ? ` - ${event.startTime}` : ''}
          </Text>
          <Text style={styles.item_text}>{event.title}</Text>
        </View>
      )
    default:
      return (
        <View style={styles.item}>
          <Text style={styles.time_text}>
            EVENT{event.startTime.length !== 0 ? ` - ${event.startTime}` : ''}
          </Text>
          <Text style={styles.item_text}>{event.title}</Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  item_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    paddingTop: 2
  },
  time_text: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18
  }
})

export default memo(Item)

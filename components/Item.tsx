import React from 'react'
import { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Event, EventType } from 'studentvue'

type Props = {
  item: { event: Event; day: string }
}

const Item: React.FC<Props> = ({ item: { event } }) => {
  const theme = useTheme()

  switch (event.type.toString()) {
    case EventType.ASSIGNMENT:
      return (
        <View
          style={[
            styles.item,
            { backgroundColor: theme.colors.surfaceVariant }
          ]}
        >
          <Text style={[styles.item_text, { color: theme.colors.onSurface }]}>
            {event.title}
          </Text>
        </View>
      )
    case EventType.HOLIDAY:
      return (
        <View style={[styles.item, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.time_text, { color: theme.colors.onSurface }]}>
            HOLIDAY{event.startTime.length !== 0 ? ` - ${event.startTime}` : ''}
          </Text>
          <Text style={[styles.item_text, { color: theme.colors.onSurface }]}>
            {event.title}
          </Text>
        </View>
      )
    default:
      return (
        <View style={[styles.item, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.time_text, { color: theme.colors.onSurface }]}>
            EVENT{event.startTime.length !== 0 ? ` - ${event.startTime}` : ''}
          </Text>
          <Text style={[styles.item_text, { color: theme.colors.onSurface }]}>
            {event.title}
          </Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    marginTop: 16
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

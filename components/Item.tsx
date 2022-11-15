import React from 'react'
import { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { AgendaEntry } from 'react-native-calendars'

type Props = {
  item: AgendaEntry
}

const Item: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.item_text}>{item.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
  }
})

export default memo(Item)

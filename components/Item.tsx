import React from 'react'
import { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'

type Props = {
  item: { name: string; day: string; startTime: string }
}

const Item: React.FC<Props> = ({ item: { name, startTime } }) => {
  return (
    <View style={styles.item}>
      {startTime && <Text style={styles.time_text}>{startTime}</Text>}
      <Text style={styles.item_text}>{name}</Text>
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
    fontSize: 14,
    paddingTop: 2
  },
  time_text: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18
  }
})

export default memo(Item)

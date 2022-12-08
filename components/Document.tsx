import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle
} from 'react-native'
import { Colors } from '../colors/Colors'

type Props = {
  name: string
  type: string
  date: string
  onPress: any
  style?: StyleProp<ViewStyle>
}

const Doc: React.FC<Props> = ({ name, type, date, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.2}
      onPress={onPress}
    >
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
      <View style={styles.info_container}>
        <Text numberOfLines={1} style={[styles.type, { flex: 1 }]}>
          {type}
        </Text>
        <Text numberOfLines={1} style={styles.type}>
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginVertical: 3.5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1
  },
  name: {
    color: Colors.black,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16
  },
  type: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4
  }
})

export default Doc

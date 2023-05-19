import { format } from 'date-fns'
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  GestureResponderEvent
} from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'

type Props = {
  name: string
  type: string
  date: Date
  onPress: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const Doc: React.FC<Props> = ({ name, type, date, onPress, style }) => {
  const theme = useTheme()
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        {
          backgroundColor: theme.dark ? Colors.dark_gray : Colors.light_yellow_white
        }
      ]}
      onPress={onPress}
    >
      <Text numberOfLines={1} style={[styles.name, { color: theme.colors.onSurface }]}>
        {name}
      </Text>
      <View style={styles.info_container}>
        <Text
          numberOfLines={1}
          style={[styles.type, { flex: 1, color: theme.colors.onSurfaceVariant, marginRight: 10 }]}
        >
          {type}
        </Text>
        <Text numberOfLines={1} style={[styles.type, { color: theme.colors.onSurfaceVariant }]}>
          {format(date, 'M/dd/yy')}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
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
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14
  },
  type: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2
  }
})

export default Doc

import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle
} from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'

type Props = {
  name: string
  type: string
  date: string
  onPress: any
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
          borderColor: theme.colors.outlineVariant
        }
      ]}
      onPress={onPress}
    >
      <Text
        numberOfLines={1}
        style={[styles.name, { color: theme.colors.onSurface }]}
      >
        {name}
      </Text>
      <View style={styles.info_container}>
        <Text
          numberOfLines={1}
          style={[
            styles.type,
            { flex: 1, color: theme.colors.onSurface, marginRight: 10 }
          ]}
        >
          {type}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.type, { color: theme.colors.onSurface }]}
        >
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 4,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1
  },
  name: {
    color: Colors.black,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14
  },
  type: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4
  }
})

export default Doc

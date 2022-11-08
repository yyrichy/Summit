import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
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
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.doc_info_container}>
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
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.off_white,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3.5,
    padding: 7,
    borderWidth: 1,
    borderColor: Colors.secondary
  },
  doc_info_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4
  },
  info_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1
  },
  name: {
    color: Colors.black,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 16 * 0.75,
    textAlign: 'left',
    ...Platform.select({
      web: {
        paddingBottom: 12 - 12 * 0.75
      },
      default: {
        paddingTop: 16 - 16 * 0.75
      }
    })
  },
  type: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 12 * 0.75,
    ...Platform.select({
      web: {
        paddingBottom: 2,
        marginTop: 5
      },
      default: {
        paddingTop: 12 - 12 * 0.75,
        marginTop: 4
      }
    })
  }
})

export default Doc

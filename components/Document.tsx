import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Colors } from '../colors/Colors'

function DocumentComponent(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.doc_info_container}>
        <Text numberOfLines={1} style={styles.name}>
          {props.name}
        </Text>
        <View style={styles.info_container}>
          <Text numberOfLines={1} style={[styles.type]}>
            {props.type}
          </Text>
          <Text numberOfLines={1} style={styles.date}>
            {props.date}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    marginTop: 7,
    padding: 7
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
    paddingTop: 16 - 16 * 0.75,
    textAlign: 'left'
  },
  type: {
    color: Colors.black,
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    flex: 1,
    lineHeight: 12 * 0.75,
    paddingTop: 12 - 12 * 0.75,
    marginTop: 4,
    textAlign: 'left'
  },
  date: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 12 * 0.75,
    paddingTop: 12 - 12 * 0.75,
    marginTop: 4,
    textAlign: 'left'
  }
})

export default DocumentComponent

import React from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native'
import { Colors } from '../colors/Colors'

function Doc(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.doc_info_container}>
        <Text
          numberOfLines={1}
          style={Platform.OS === 'web' ? styles.name_web : styles.name}
        >
          {props.name}
        </Text>
        <View style={styles.info_container}>
          <Text
            numberOfLines={1}
            style={[
              Platform.OS === 'web' ? styles.type_web : styles.type,
              { flex: 1 }
            ]}
          >
            {props.type}
          </Text>
          <Text
            numberOfLines={1}
            style={Platform.OS === 'web' ? styles.type_web : styles.type}
          >
            {props.date}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.off_white,
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    marginTop: 7,
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
    paddingTop: 16 - 16 * 0.75,
    textAlign: 'left'
  },
  name_web: {
    color: Colors.black,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 16 * 0.75,
    textAlign: 'left',
    paddingBottom: 12 - 12 * 0.75
  },
  type: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 12 * 0.75,
    paddingTop: 12 - 12 * 0.75,
    marginTop: 4
  },
  type_web: {
    color: Colors.black,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 12 * 0.75 + 2,
    paddingBottom: 2,
    marginTop: 5
  }
})

export default Doc

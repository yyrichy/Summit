import React, { memo } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors } from '../colors/Colors'

const District = (props) => {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
        marginHorizontal: 10,
        backgroundColor: props.isSelected && Colors.light_gray,
        borderBottomWidth: 1,
        borderColor: Colors.secondary
      }}
      onPress={props.onPress}
      activeOpacity={0.2}
    >
      <Text numberOfLines={1} style={styles.dropdown_text_style}>
        {props.label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  dropdown_text_style: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16
  }
})

export default memo(District)

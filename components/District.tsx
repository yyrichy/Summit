import React from 'react'
import { memo } from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import { Colors } from '../colors/Colors'
const District = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        props.listItemContainerStyle,
        {
          backgroundColor: props.isSelected && Colors.light_gray
        }
      ]}
      onPress={props.onPress}
      activeOpacity={0.2}
    >
      <View style={styles.district_name_container}>
        <Text numberOfLines={1} style={props.listItemLabelStyle}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  district_name_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

export default memo(District)

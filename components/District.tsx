import React, { memo } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors } from '../colors/Colors'

type Props = {
  isSelected: boolean
  onPress: any
  label: string
}

const District: React.FC<Props> = ({ isSelected, onPress, label }) => {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
        marginHorizontal: 10,
        backgroundColor: isSelected && Colors.light_gray,
        borderBottomWidth: 1,
        borderColor: Colors.secondary
      }}
      onPress={onPress}
      activeOpacity={0.2}
    >
      <Text numberOfLines={1} style={styles.dropdown_text_style}>
        {label}
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

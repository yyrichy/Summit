import React, { memo } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import { Colors } from '../colors/Colors'

type Props = {
  selected: boolean
  onPress: any
  item: SchoolDistrict
}

const District: React.FC<Props> = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        selected && {
          backgroundColor: Colors.off_white,
          padding: 8,
          borderRadius: 5
        }
      }
    >
      <Text
        style={{
          fontFamily: 'Inter_500Medium',
          fontSize: 16
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          color: Colors.medium_gray,
          marginTop: 2
        }}
      >
        {item.address}
      </Text>
    </TouchableOpacity>
  )
}

export default memo(District)

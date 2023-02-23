import React, { memo } from 'react'
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native'
import { useTheme } from 'react-native-paper'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'

type Props = {
  selected: boolean
  onPress: (event: GestureResponderEvent) => void
  item: SchoolDistrict
}

const District: React.FC<Props> = ({ item, onPress, selected }) => {
  const theme = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        selected && {
          backgroundColor: theme.colors.surfaceVariant,
          padding: 8,
          borderRadius: 5
        }
      }
    >
      <Text
        style={{
          fontFamily: 'Inter_500Medium',
          fontSize: 16,
          color: theme.colors.onSurface
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          color: theme.colors.onSurfaceVariant,
          marginTop: 2
        }}
      >
        {item.address}
      </Text>
    </TouchableOpacity>
  )
}

export default memo(District)

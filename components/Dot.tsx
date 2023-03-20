import React from 'react'
import { Text, StyleProp, TextStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

type Props = {
  size?: number
  style?: StyleProp<TextStyle>
  color?: string
}

const Dot: React.FC<Props> = ({ size, style, color }) => {
  const theme = useTheme()

  return (
    <Text
      style={[
        {
          marginHorizontal: 4,
          fontSize: size || 12,
          color: color || theme.colors.onSurface
        },
        style
      ]}
    >
      {'\u00B7'}
    </Text>
  )
}

export default Dot

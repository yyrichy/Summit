import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from 'react-native-paper'

type Props = {
  children: any
  backgroundColor?: string
  textColor?: string
}

const Chip: React.FC<Props> = ({ children, backgroundColor, textColor }) => {
  const theme = useTheme()

  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: backgroundColor || theme.colors.surfaceVariant,
        borderRadius: 8,
        alignSelf: 'flex-start'
      }}
    >
      <Text style={{ color: textColor || theme.colors.onSurfaceVariant, fontSize: 12 }}>
        {children}
      </Text>
    </View>
  )
}

export default Chip

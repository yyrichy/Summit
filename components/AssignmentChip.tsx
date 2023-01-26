import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Badge, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '../colors/Colors'

type Props = {
  icon: string | any
  text: string
  style?: any
  showBadge?: boolean
}

const AssignmentChip: React.FC<Props> = ({
  icon,
  text,
  style,
  showBadge
}: Props) => {
  const theme = useTheme()

  return (
    <View
      style={[
        {
          marginVertical: 4,
          borderRadius: 8,
          paddingLeft: 8,
          paddingRight: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: StyleSheet.hairlineWidth,
          height: 32
        },
        style
      ]}
    >
      <View>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={theme.colors.primary}
        />
        {showBadge && (
          <Badge
            style={{ position: 'absolute', top: 0, right: 0 }}
            size={8}
          ></Badge>
        )}
      </View>
      <Text style={[theme.fonts.labelLarge, { marginLeft: 8 }]}>{text}</Text>
    </View>
  )
}

export default AssignmentChip

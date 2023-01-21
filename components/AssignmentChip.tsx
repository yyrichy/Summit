import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Badge } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
  return (
    <View
      style={[
        {
          backgroundColor: Colors.off_white,
          marginVertical: 4,
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: StyleSheet.hairlineWidth
        },
        style
      ]}
    >
      <View>
        <MaterialCommunityIcons name={icon} size={20} />
        {showBadge && (
          <Badge
            style={{ position: 'absolute', top: 0, right: 0 }}
            size={8}
          ></Badge>
        )}
      </View>
      <Text style={{ fontSize: 12, marginLeft: 6 }}>{text}</Text>
    </View>
  )
}

export default AssignmentChip

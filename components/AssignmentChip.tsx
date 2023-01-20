import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  icon: string | any
  text: string
  style?: any
}

const AssignmentChip: React.FC<Props> = ({ icon, text, style }: Props) => {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.off_white,
          marginVertical: 4,
          borderRadius: 16,
          paddingHorizontal: 8,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: StyleSheet.hairlineWidth
        },
        style
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} />
      <Text style={{ fontSize: 12, marginLeft: 6 }}>{text}</Text>
    </View>
  )
}

export default AssignmentChip

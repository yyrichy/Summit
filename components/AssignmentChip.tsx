import React from 'react'
import { Chip } from 'react-native-paper'
import { Colors } from '../colors/Colors'

const AssignmentChip = ({ icon, text }) => {
  return (
    <Chip
      mode="flat"
      icon={icon}
      style={{
        backgroundColor: Colors.off_white,
        marginVertical: 4
      }}
    >
      {text}
    </Chip>
  )
}

export default AssignmentChip

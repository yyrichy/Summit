import React from 'react'
import { Chip } from 'react-native-paper'
import { Colors } from '../colors/Colors'

type Props = {
  icon: string
  text: string
  style?: any
}

const AssignmentChip: React.FC<Props> = ({ icon, text, style }: Props) => {
  return (
    <Chip
      mode="flat"
      icon={icon}
      style={[
        {
          backgroundColor: Colors.off_white,
          marginVertical: 4
        },
        style
      ]}
    >
      {text}
    </Chip>
  )
}

export default AssignmentChip

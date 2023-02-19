import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { Colors } from '../colors/Colors'

type Props = {
  title: string
  description?: string
  onPress?: any
  position: 'top' | 'middle' | 'bottom' | 'single'
  children?: any
}

const Setting: React.FC<Props> = ({
  title,
  onPress,
  position,
  description,
  children
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles['container_' + position]}
    >
      <View style={{ flex: 1, marginRight: 18 }}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container_middle: {
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 60
  },
  container_top: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 60
  },
  container_bottom: {
    backgroundColor: Colors.white,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 60
  },
  container_single: {
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 60
  },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  description: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.medium_gray,
    marginTop: 2
  }
})

export default Setting

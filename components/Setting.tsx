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
      activeOpacity={onPress ? 0.2 : 1}
      style={styles['container_' + position]}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container_middle: {
    marginHorizontal: 25,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center'
  },
  container_top: {
    marginHorizontal: 25,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center'
  },
  container_bottom: {
    marginHorizontal: 25,
    backgroundColor: Colors.white,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center'
  },
  container_single: {
    marginHorizontal: 25,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17
  },
  description: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: Colors.onyx_gray,
    marginTop: 3
  }
})

export default Setting

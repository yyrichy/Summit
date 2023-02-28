import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, GestureResponderEvent } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'
import { palette } from '../theme/colors'

type Props = {
  title: string
  description?: string
  onPress?: (event: GestureResponderEvent) => void
  position: 'top' | 'middle' | 'bottom' | 'single'
  children?: any
}

const Setting: React.FC<Props> = ({ title, onPress, position, description, children }: Props) => {
  const theme = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles['container_' + position],
        {
          backgroundColor: theme.dark ? theme.colors.primaryContainer : theme.colors.surface
        }
      ]}
    >
      <View style={{ flex: 1, marginRight: 18 }}>
        <Text style={[styles.title, { color: theme.colors.onPrimaryContainer }]}>{title}</Text>
        {description && (
          <Text
            style={[
              styles.description,
              {
                color: theme.dark ? palette.neutralVariant90 : Colors.medium_gray
              }
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container_middle: {
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 60
  },
  container_bottom: {
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
    marginTop: 4
  }
})

export default Setting

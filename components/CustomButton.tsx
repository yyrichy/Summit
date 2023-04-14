import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  GestureResponderEvent
} from 'react-native'

type Props = {
  onPress: (event: GestureResponderEvent) => void
  text: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  containerStyle: StyleProp<ViewStyle>
  disabled: boolean
  children?: any
}

const CustomButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor,
  textColor,
  fontFamily,
  containerStyle,
  disabled,
  children
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[containerStyle, { backgroundColor: backgroundColor }]}
      disabled={disabled}
    >
      <View style={{ flexDirection: 'row' }}>
        {children}
        <Text style={[styles.buttonText, { color: textColor, fontFamily: fontFamily }]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 24
  }
})

export default CustomButton

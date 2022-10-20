import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

type Props = {
  onPress: any
  text: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  containerStyle: any
  disabled: boolean
}

const CustomButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor,
  textColor,
  fontFamily,
  containerStyle,
  disabled
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[containerStyle, { backgroundColor: backgroundColor }]}
      disabled={disabled}
      activeOpacity={0.5}
    >
      <View>
        <Text
          style={[
            styles.buttonText,
            { color: textColor, fontFamily: fontFamily }
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  }
})

export default CustomButton

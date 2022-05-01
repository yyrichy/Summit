import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {
  onPress: any
  text: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  containerStyle: any
}

const CustomButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor,
  textColor,
  fontFamily,
  containerStyle
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[containerStyle, { backgroundColor: backgroundColor }]}
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

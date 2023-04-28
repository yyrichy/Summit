import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Dialog, Divider, Portal, useTheme } from 'react-native-paper'
import ColorPicker, { Swatches } from 'reanimated-color-picker'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { toast } from '../util/Util'

type Props = {
  visible: boolean
  onDismiss: () => void
}

const ThemePicker: React.FC<Props> = ({ visible, onDismiss }) => {
  const theme = useTheme()
  const { updateTheme } = useContext(AppContext)
  const customSwatches = [
    '#e67777',
    '#e6ab77',
    '#e6e277',
    '#7de677',
    '#77e6c6',
    '#778ae6',
    '#e677c3'
  ]

  const onColorSelect = async (color) => {
    updateTheme(color.hex)
    onDismiss()
    try {
      await AsyncStorage.setItem('ThemeColor', color.hex)
    } catch (e) {
      toast('Cannot save theme color', theme.dark)
    }
  }

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Dialog.Title>Choose Custom Theme</Dialog.Title>
        <Dialog.Content>
          <ColorPicker
            sliderThickness={25}
            thumbSize={24}
            thumbShape="circle"
            onChange={onColorSelect}
            adaptSpectrum
            boundedThumb
          >
            <Swatches
              style={styles.swatches_container}
              swatchStyle={styles.swatch}
              colors={customSwatches}
            />
          </ColorPicker>
          <Divider style={{ marginVertical: 20 }} />
          <Button mode="outlined" onPress={() => onColorSelect({ hex: Colors.primary })}>
            Default Theme
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  swatches_container: {
    borderColor: '#bebdbe',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  swatch: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0
  }
})

export default ThemePicker

// from @md3-ui/switch

import { ButtonBase, ButtonBaseProps } from '@md3-ui/button'
import { useControlled } from '@md3-ui/hooks'
import { styled, SxProps, useThemeProps } from '@md3-ui/system'
import { createChainedFunction, __DEV__ } from '@md3-ui/utils'
import * as React from 'react'
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Platform,
  View as RNView,
  ViewStyle as RNViewStyle
} from 'react-native'

export interface SwitchChangeEventData extends NativeTouchEvent {
  checked: boolean
  value?: string
}

export interface SwitchBaseProps extends ButtonBaseProps {
  /**
   * If `true`, the component is checked.
   */
  checked?: boolean
  /**
   * @ignore
   */
  defaultChecked?: boolean
  /**
   * @ignore
   */
  editable?: boolean
  /**
   * Name attribute of the `input` element.
   */
  name?: string
  /**
   * Callback fired when the state is changed.
   *
   * @param event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   * You can pull out the new checked state by accessing `event.target.checked`
   * (boolean).
   */
  onChange?: (event: NativeSyntheticEvent<SwitchChangeEventData>) => void
  /**
   * If `true`, the `input` element is required.
   * @default false
   */
  required?: boolean
  /**
   * Override or extend the styles applied to the component.
   */
  styles?: {
    root?: RNViewStyle
    input?: React.CSSProperties
  }
  /**
   * The system prop that allows defining system overrides as well as additional
   * styles.
   */
  sx?: SxProps
  /**
   * The input component prop `type`.
   * @default "checkbox"
   */
  type?: 'checkbox' | 'radio'
  /**
   * The value of the component.
   */
  value?: string
}

const SwitchBaseRoot = styled(ButtonBase, {
  name: 'SwitchBase',
  slot: 'Root'
})(({ theme }) => ({
  borderRadius: theme.shape.corner.full
}))

const SwitchBaseInput = styled('input', {
  name: 'SwitchBase',
  slot: 'Input',
  skipSx: true
})({
  height: '100%',
  left: 0,
  margin: 0,
  opacity: 0,
  padding: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 1,

  ...(Platform.OS === 'web' && {
    cursor: 'inherit'
  })
})

export const SwitchBase = React.forwardRef<RNView, SwitchBaseProps>((inProps, ref) => {
  const {
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    editable = true,
    name,
    nativeID,
    onChange,
    onPress,
    required = false,
    style,
    styles,
    type = 'checkbox',
    value,
    ...props
  } = useThemeProps({
    name: 'SwitchBase',
    props: inProps
  })

  const [checked, setChecked] = useControlled({
    controlled: checkedProp,
    default: Boolean(defaultChecked),
    name: 'SwitchBase',
    state: 'checked'
  })

  const handleChange = (event: GestureResponderEvent | React.ChangeEvent<HTMLInputElement>) => {
    const newChecked =
      typeof event.target === 'object' && 'checked' in event.target
        ? event.target.checked
        : !checked

    setChecked(newChecked)
    ;(event.nativeEvent as any).checked = newChecked
    ;(event.nativeEvent as any).value = value ?? 'on'

    onChange?.(event as NativeSyntheticEvent<SwitchChangeEventData>)
  }

  return (
    <SwitchBaseRoot
      ref={ref}
      centerRipple
      accessibilityRole="none"
      disabled={disabled}
      style={[style, styles?.root]}
      {...(Platform.OS === 'web'
        ? {
            focusable: false,
            onPress
          }
        : {
            nativeID,
            onPress: createChainedFunction(onPress, handleChange)
          })}
      {...props}
    >
      <>
        {Platform.OS === 'web' && (
          <SwitchBaseInput
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            id={nativeID}
            name={name}
            readOnly={!editable}
            required={required}
            style={styles?.input}
            type={type}
            onChange={handleChange}
            {...(type === 'checkbox' && value == null ? {} : { value })}
          />
        )}
        {children}
      </>
    </SwitchBaseRoot>
  )
})

if (__DEV__) {
  SwitchBase.displayName = 'SwitchBase'
}

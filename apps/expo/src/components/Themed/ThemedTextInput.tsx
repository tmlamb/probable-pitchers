import React from 'react'
import {
  ColorValue,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  ViewStyle
} from 'react-native'
import Animated, { FadeInRight, FadeOutDown } from 'react-native-reanimated'
import { ClassInput } from 'twrnc/dist/esm/types'
import tw from '../../tailwind'
import { AlertText, primaryTextColor, SecondaryText, secondaryTextColor } from './ThemedText'
import ThemedView from './ThemedView'

type Props = {
  onChangeText?: (text: string) => void
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
  onBlur?: (e: unknown) => void
  value?: string
  style?: ViewStyle
  textInputStyle?: ClassInput
  labelStyle?: ClassInput
  label?: string
  placeholder?: string
  placeholderTextColor?: ColorValue
  maxLength?: number
  selectTextOnFocus?: boolean
  clearTextOnFocus?: boolean
  keyboardType?: KeyboardTypeOptions
  numeric?: boolean
  editable?: boolean
  selection?: { start: number; end?: number }
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void
  innerRef?: React.LegacyRef<NativeTextInput>
  error?: string
  errorStyle?: ClassInput
  accessibilityLabel?: string
  testID?: string
}

// When text in an input is right justifed, any trailing whitespace in the field gets treated
// as space to be removed so that the text is right aligned. This causes spaces to be ignored
// visually until a non-whitespace character is entered. &nbsp; (\u00a0) does not behave this
// way, so swapping them in for the input's value fixes the issue.
const nbspReplace = (str: string) => str.replace(/\u0020/g, '\u00a0')
const spaceReplace = (str: string) => str.replace(/\u00a0/g, '\u0020')

// Prevents non-numeric values in numeric fields and trims leading zeros.
const numericReplace = (str: string) => str.replace(/[^0-9|\\.]/g, '').replace(/^0+/g, '')

interface PropsFilled extends Props {
  onChangeText: (text: string) => void
  keyboardType: KeyboardTypeOptions
}

export default function TextInput({
  onChangeText,
  onChange,
  onBlur,
  value,
  style,
  textInputStyle,
  labelStyle,
  label,
  placeholder,
  placeholderTextColor,
  maxLength,
  selectTextOnFocus,
  clearTextOnFocus,
  keyboardType,
  numeric,
  editable,
  selection,
  onKeyPress,
  innerRef,
  error,
  errorStyle,
  accessibilityLabel,
  testID
}: PropsFilled) {
  const handleChange = (text: string) => {
    const normalizedText = spaceReplace(numeric ? numericReplace(text) : text)
    onChangeText(normalizedText)
  }

  return (
    <ThemedView style={tw.style('relative py-0 web:px-0', style)}>
      <ThemedView style={tw`px-0 py-2 web:py-0 relative w-full bg-transparent`}>
        {label && (
          <SecondaryText
            style={tw.style(
              'absolute leading-tight text-lg tracking-tight pl-0 web:pl-3',
              labelStyle
            )}
            accessible={false}
          >
            {label}
          </SecondaryText>
        )}
        <NativeTextInput
          onChangeText={handleChange}
          onChange={onChange}
          onBlur={onBlur}
          value={value ? nbspReplace(value) : value}
          style={tw.style(
            primaryTextColor,
            'w-full pb-[2.8px] pt-[2.5px] android:py-[.15px] z-20 pr-0 text-lg web:text-right web:pr-3 web:pt-[10.75px] web:pb-[10.75px] leading-tight tracking-tight',
            textInputStyle
          )}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || tw.color(secondaryTextColor)}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlign={label ? 'right' : undefined}
          textAlignVertical="center"
          selectTextOnFocus={selectTextOnFocus}
          clearTextOnFocus={clearTextOnFocus}
          editable={editable}
          selection={selection}
          onKeyPress={onKeyPress}
          multiline
          numberOfLines={1}
          scrollEnabled={false}
          ref={innerRef}
          blurOnSubmit
          accessibilityLabel={accessibilityLabel || label}
          testID={testID}
        />
      </ThemedView>
      {error && (
        <Animated.View
          entering={FadeInRight.springify().stiffness(40).damping(6).mass(0.3)}
          exiting={FadeOutDown.springify().stiffness(40).damping(6).mass(0.3)}
          pointerEvents="none"
          style={tw.style(
            'absolute items-center justify-center h-full z-0 -top-[32px] right-3',
            errorStyle
          )}
        >
          <AlertText accessibilityRole="alert" style={tw`text-sm`}>
            {error}
          </AlertText>
        </Animated.View>
      )}
    </ThemedView>
  )
}

TextInput.defaultProps = {
  value: undefined,
  style: undefined,
  onChangeText: (text: string) => text,
  onChange: undefined,
  onBlur: undefined,
  textInputStyle: undefined,
  labelStyle: undefined,
  maxLength: undefined,
  label: undefined,
  placeholder: undefined,
  placeholderTextColor: undefined,
  selectTextOnFocus: false,
  clearTextOnFocus: false,
  numeric: false,
  keyboardType: 'default',
  editable: true,
  selection: undefined,
  onKeyPress: undefined,
  innerRef: undefined,
  error: undefined,
  errorStyle: undefined,
  accessibilityLabel: undefined,
  testID: undefined
}

import React from 'react'
import { Controller, FieldValues } from 'react-hook-form'
import { ViewProps } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

type Props = {
  control: any
  name: string
  label: string
  placeholder?: string
  secureTextEntry?: boolean
  multiline?: boolean
  numberOfLines?: number
  rules?: object,
} & FieldValues

export const TextField = ({ control, name, label, placeholder, secureTextEntry, rules, multiline=false, numberOfLines=5, ...props}: Props) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <>
        <TextInput
          mode="outlined"
          label={label}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onBlur={onBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onChangeText={onChange}
          error={!!error}
          style={{ marginBottom: 4 }}
          {...props}
        />
        {error && (
          <HelperText type="error" visible={!!error}>
            {error.message}
          </HelperText>
        )}
      </>
    )}
  />
)

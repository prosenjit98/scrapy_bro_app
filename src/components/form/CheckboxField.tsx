import React from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox, Text } from 'react-native-paper'
import { View } from 'react-native'

type Props = {
  control: any
  name: string
  label: string
}

export const CheckboxField = ({ control, name, label }: Props) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange } }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <Checkbox status={value ? 'checked' : 'unchecked'} onPress={() => onChange(!value)} />
        <Text>{label}</Text>
      </View>
    )}
  />
)

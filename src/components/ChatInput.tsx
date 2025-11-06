import { useThemeStore } from '@/stores/themeStore'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { IconButton } from 'react-native-paper'

export const ChatInput = ({ onSend, isLoading, name, control, reset }: { onSend: () => void, isLoading: boolean, name: string, control: any, reset: () => void }) => {
  const theme = useThemeStore().theme

  const handleSend = () => {
    onSend()
    reset()
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
        // marginBottom: 10
      }}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput
            onChangeText={onChange}
            placeholder="Type a message"
            placeholderTextColor="gray"
            value={value}
            onBlur={onBlur}
            style={{
              flex: 1,
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 25,
              paddingHorizontal: 16,
              paddingVertical: 16,
              color: theme.colors.onSurface,
            }}
          />
        )}
      />
      <TouchableOpacity onPress={handleSend} disabled={isLoading}>
        <IconButton icon={() => <MaterialDesignIcons name="send" size={34} color={theme.colors.primary} />} />
      </TouchableOpacity>
    </View>
  )
}

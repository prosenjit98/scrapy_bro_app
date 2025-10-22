import React from 'react'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { Snackbar } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'

export const AppSnackbar = () => {
  const { visible, message, type, hideSnackbar } = useSnackbarStore()
  const theme = useThemeStore().theme;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.primary
      case 'error':
        return theme.colors.error
      case 'info':
      default:
        return theme.colors.inverseOnSurface
    }
  }

  return (
    <Snackbar
      visible={visible}
      onDismiss={hideSnackbar}
      duration={3000}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
    >
      {message}
    </Snackbar>
  )
}

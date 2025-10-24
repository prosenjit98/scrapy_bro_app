// src/components/common/NoData.tsx
import { useThemeStore } from '@/stores/themeStore'
import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Text, Button, useTheme } from 'react-native-paper'

interface NoDataProps {
  title?: string
  description?: string
  imageSource?: any
  onRetry?: () => void
  buttonLabel?: string
}

export const NoData: React.FC<NoDataProps> = ({
  title = 'No Data Found',
  description = 'There’s nothing to show right now.',
  imageSource,
  onRetry,
  buttonLabel = 'Retry',
}) => {
  const { theme, mode } = useThemeStore();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FastImage
        source={
          imageSource || (mode == 'dark' ? require('@/assets/images/No_data_dark.gif') : require('@/assets/images/No_data_light.gif'))
        }
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.onBackground }]}
      >
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
      >
        {description}
      </Text>

      {onRetry && (
        <Button
          mode="contained-tonal"
          style={styles.button}
          onPress={onRetry}
        >
          {buttonLabel}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 360,
    height: 360,
    marginBottom: 20,
    opacity: 0.8,
  },
  title: {
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
  },
})

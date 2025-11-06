import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import React from 'react'
import { View, Text } from 'react-native'

export const MessageBubble = ({ message }: { message: Comment }) => {
  const theme = useThemeStore().theme
  const { user } = useAuthStore()
  const isSender = user ? user.id === message.userId : false;
  return (
    <View
      style={{
        alignSelf: isSender ? 'flex-end' : 'flex-start',
        backgroundColor: isSender
          ? theme.colors.primary
          : theme.colors.surfaceVariant,
        borderRadius: 20,
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 28,
        maxWidth: '75%',
      }}
    >
      <Text
        style={{
          color: isSender ? '#fff' : theme.colors.onSurface,
          fontSize: 15,
        }}
      >
        {message.content}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: isSender ? 'rgba(255,255,255,0.7)' : 'gray',
          textAlign: 'right',
          marginTop: 4,
        }}
      >
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  )
}

export default MessageBubble
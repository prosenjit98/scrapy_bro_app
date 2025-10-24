import React from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { View, FlatList } from 'react-native'
import { Card, Text, IconButton } from 'react-native-paper'
import FastImage from 'react-native-fast-image'

export const InquiryCard = ({ inquiry, onEdit, onDelete }: any) => {
  const theme = useThemeStore().theme;

  return (
    <Card
      style={{
        marginVertical: 8,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Card.Title
        title={inquiry.title}
        subtitle={`Posted on ${new Date(inquiry.created_at).toLocaleDateString()}`}
        right={() => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon="pencil" onPress={() => onEdit(inquiry)} />
            <IconButton icon="delete" onPress={() => onDelete(inquiry.id)} />
          </View>
        )}
      />

      {inquiry.images?.length > 0 && (
        <FlatList
          data={inquiry.images}
          keyExtractor={(item, i) => `${item}-${i}`}
          horizontal
          renderItem={({ item }) => (
            <FastImage
              source={{ uri: item }}
              style={{ width: 120, height: 120, margin: 8, borderRadius: 8 }}
            />
          )}
        />
      )}

      <Card.Content>
        <Text>{inquiry.description}</Text>
      </Card.Content>
    </Card>
  )
}

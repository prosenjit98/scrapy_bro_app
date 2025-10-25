// src/screens/inquiry/components/InquiryCard.tsx
import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Text, Card, IconButton } from 'react-native-paper'
import dayjs from 'dayjs'
import { useThemeStore } from '@/stores/themeStore'

interface InquiryCardProps {
  inquiry: Inquiry
  onPress?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const renderImages = (images: InquiryAttachment[]) => {
  const displayedImages = images.slice(0, 4);
  const extraCount = images.length - 4;
  if (displayedImages.length === 0) return null;
  return (
    <View style={{ borderRadius: 10, overflow: 'hidden', marginTop: 5 }}>
      {displayedImages.length === 1 && (
        <Image
          source={{ uri: displayedImages[0].file.url }}
          style={{ width: '100%', height: 250, borderRadius: 8 }}
        />
      )}

      {displayedImages.length === 2 && (
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {displayedImages.map((file, idx) => (
            <Image
              key={idx}
              source={{ uri: file.file.url }}
              style={{ flex: 1, height: 200 }}
            />
          ))}
        </View>
      )}

      {displayedImages.length === 3 && (
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {displayedImages.slice(0, 2).map((file, idx) => (
              <Image
                key={idx}
                source={{ uri: file.file.url }}
                style={{ flex: 1, height: 150 }}
              />
            ))}
          </View>
          <Image
            source={{ uri: displayedImages[2].file.url }}
            style={{ width: '100%', height: 150 }}
          />
        </View>
      )}

      {displayedImages.length >= 4 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
          {displayedImages.map((file, idx) => (
            <View key={idx} style={{ width: '49%', height: 150 }}>
              <Image
                source={{ uri: file.file.url }}
                style={{ width: '100%', height: '100%', borderRadius: 4 }}
              />
              {idx === 3 && extraCount > 0 && (
                <View
                  style={{
                    ...StyleSheet.absoluteFill,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                    +{extraCount}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export const InquiryCard: React.FC<InquiryCardProps> = ({
  inquiry,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useThemeStore().theme

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.card}>
        <Card.Title
          title={inquiry.user?.fullName || 'Anonymous User'}
          subtitle={dayjs(inquiry.createdAt).format('DD/MM/YYYY')}
          left={() => (
            <Avatar.Image
              size={42}
              source={
                require('@/assets/images/avatar.png')
              }
            />
          )}
          right={() => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="pencil" size={18} onPress={onEdit} />
              {onDelete && <IconButton icon="delete" size={18} onPress={onDelete} />}
            </View>
          )}
        />
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>
            {inquiry.title}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={3}
          >
            {inquiry.partDescription}
          </Text>
        </Card.Content>

        {inquiry.attachments && inquiry.attachments.length > 0 && (
          <View>{renderImages(inquiry.attachments)}</View>
        )}

        <Card.Actions style={styles.actions}>
          <IconButton icon="message-outline" size={20} />
          <Text>{1} Proposals</Text>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  image: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    margin: '1%',
  },
  actions: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
})

// src/screens/inquiry/components/InquiryCard.tsx
import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Card, IconButton } from 'react-native-paper'
import Icon from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'

interface InquiryCardProps {
  inquiry: Inquiry
  onPress?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const getStatusConfig = (status?: string | null) => {
  if (!status) return { label: 'Pending', color: '#f59e0b', text: '#7c2d12' }
  const normalized = status.toLowerCase()
  if (normalized.includes('accept')) return { label: 'Accepted', color: '#10b981', text: '#065f46' }
  if (normalized.includes('reject') || normalized.includes('cancel')) return { label: 'Rejected', color: '#ef4444', text: '#7f1d1d' }
  if (normalized.includes('pending')) return { label: 'Pending', color: '#f59e0b', text: '#7c2d12' }
  return { label: status.charAt(0).toUpperCase() + status.slice(1), color: '#6b7280', text: '#111827' }
}

export const InquiryCard: React.FC<InquiryCardProps> = ({
  inquiry,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const status = getStatusConfig(inquiry.status)
  const imageUrl = inquiry.attachments?.[0]?.file?.url
  const proposalsCount = inquiry.proposalsCount ?? inquiry.proposals?.length ?? 0

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="image-off-outline" size={20} color={colors.onSurfaceVariant} />
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                {inquiry.title}
              </Text>
              <View style={styles.actions}>
                {onEdit && (
                  <IconButton
                    icon="pencil"
                    size={18}
                    onPress={(e) => {
                      e.stopPropagation()
                      onEdit()
                    }}
                  />
                )}
                {onDelete && (
                  <IconButton
                    icon="delete"
                    size={18}
                    onPress={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                  />
                )}
              </View>
            </View>

            <Text
              variant="bodySmall"
              style={[styles.description, { color: colors.onSurfaceVariant }]}
              numberOfLines={2}
            >
              {inquiry.partDescription}
            </Text>

            <View style={styles.metaRow}>
              <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                <Text style={[styles.statusText, { color: status.text }]}>
                  {status.label}
                </Text>
              </View>
              <View style={styles.proposalsRow}>
                <Icon name="message-outline" size={16} color={colors.onSurfaceVariant} />
                <Text style={styles.proposalsText}>{proposalsCount} Proposals</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity >
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    card: {
      marginBottom: 12,
      borderRadius: 12,
      elevation: 2,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    imageWrapper: {
      width: 64,
      height: 64,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: colors.surfaceVariant,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imagePlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    title: {
      fontWeight: '600',
      flex: 1,
    },
    description: {
      marginTop: 4,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: -8,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    proposalsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    proposalsText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
    },
  })

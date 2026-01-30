

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Text } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Icon from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import Row from '../Row'
import { AppTheme } from '@/theme'

const BargainingCard: React.FC<{ item: Proposal; actionButton?: () => React.ReactNode }> = ({ item, actionButton }) => {
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)

  const imageUrl =
    item.part?.images?.[0]
      ? typeof item.part.images[0] === 'string'
        ? item.part.images[0]
        : (item.part.images[0] as any)?.file?.url ?? (item.part.images[0] as any)?.url
      : null

  const statusLabel = item.isSelfAccepted === null ? 'Pending' : item.isSelfAccepted ? 'Accepted' : 'Rejected'

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Row style={styles.topRow}>
          {imageUrl ? (
            <FastImage source={{ uri: imageUrl }} style={styles.thumb} resizeMode="cover" />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Icon name="image" size={28} color={colors.mutedText} />
            </View>
          )}

          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={2}>{item.part?.name}</Text>
            <Text style={styles.sub}>{item.part?.make?.name} • {item.part?.model?.name}</Text>
          </View>

          <View style={styles.statusWrap}>
            <Text style={[styles.status, item.isSelfAccepted === null ? { backgroundColor: colors.mutedText, color: '#fff' } : item.isSelfAccepted ? { backgroundColor: colors.primaryContainer, color: colors.primary } : { backgroundColor: colors.error, color: '#fff' }]}>{statusLabel}</Text>
          </View>
        </Row>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{item.description || 'No message provided'}</Text>
        </View>

        <Row style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Proposed Per Unit Price</Text>
            <Text style={styles.price}>₹ {item.price}</Text>
          </View>
          {actionButton && <View style={styles.action}>{actionButton()}</View>}
        </Row>
      </Card.Content>
    </Card>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    card: {
      margin: 8,
      borderRadius: 12,
      overflow: 'hidden',
    },
    topRow: {
      alignItems: 'center',
      gap: 12,
    },
    thumb: {
      width: 72,
      height: 72,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
    },
    thumbPlaceholder: {
      width: 72,
      height: 72,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleWrap: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: '#111',
    },
    sub: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },
    statusWrap: {
      marginLeft: 8,
    },
    status: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      fontSize: 12,
      fontWeight: '700',
    },
    messageBox: {
      backgroundColor: colors.outlineVariant,
      marginVertical: 12,
      padding: 10,
      borderRadius: 8,
    },
    messageText: {
      color: colors.primary,
    },
    priceRow: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    priceLabel: {
      fontSize: 13,
      color: '#666',
    },
    price: {
      fontSize: 20,
      fontWeight: '800',
      color: '#2a9d8f',
      marginTop: 4,
    },
    action: {
      marginLeft: 12,
      alignSelf: 'flex-end',
    },
  })

export default BargainingCard

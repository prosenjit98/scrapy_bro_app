import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Dimensions, Alert } from 'react-native'
import React from 'react'
import { Card, Button, Divider } from 'react-native-paper'
import { formatDate } from '@/utility/format'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { StyleSheet } from 'react-native'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import FastImage from 'react-native-fast-image'
import { statusConfig } from '@/constants'

const OrderRow = ({ item, onPress, onTrack, onContact, onRate }: { item: Order; onPress: (o: Order) => void; onTrack: (o: Order) => void; onContact: (o: Order) => void; onRate: (o: Order) => void }) => {
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const config = statusConfig(item.status)

  const imageUrl = item.part?.images && item.part.images.length > 0 && item.part.images[0].file.url ? item.part.images[0].file.url : null
  // const imageUrl = typeof item.productImage === 'string'
  //   ? item.productImage
  //   : (item.productImage as any)?.file?.url ?? (item.productImage as any)?.url

  return (
    <Card style={styles.orderCard}>
      <Card.Content>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
            <Icon name={config.icon as MaterialDesignIconsIconName} size={14} color={config.color} />
            <Text style={[styles.statusLabel, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.orderId}>{`Order ID: ${String(item.id).slice(0, 8)}`}</Text>

        <Divider style={styles.divider} />

        {/* Product Info */}
        <View style={styles.productSection}>
          {imageUrl && (
            <FastImage
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.productName} numberOfLines={2}>{item.part?.name || 'Product'}</Text>
            <Text style={styles.vendorName}>{item.vendor}</Text>
            <Text style={styles.price}>₹{item.totalPrice?.toFixed(2)}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{item.paymentMethod || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{item.quantity} item{item.quantity > 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {item.status === 'completed' ? (
            <Button
              mode="contained"
              style={styles.rateButton}
              onPress={() => onRate(item)}
            >
              Rate Vendor
            </Button>
          ) : (
            <View style={styles.actionButtonsRow}>
              <Button
                mode="outlined"
                style={styles.contactButton}
                onPress={() => onContact(item)}
              >
                Contact
              </Button>
              <Button
                mode="contained"
                style={styles.trackButton}
                onPress={() => onTrack(item)}
              >
                Track
              </Button>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  )
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  orderCard: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  orderId: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 10,
  },
  trackButton: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4f46e5',
  },
  detailsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  actionsContainer: {
    marginTop: 12,
  },
  rateButton: {
    width: '100%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
  },
  productSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
})

export default OrderRow
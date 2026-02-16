import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native'
import { Card, Text, Button, Divider, Modal } from 'react-native-paper'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { useUpdateOrderStatus } from '@/stores/hooks/useOrders'
import { AppTheme } from '@/theme'
import { statusConfig } from '@/constants'
import MyNewHeader from '@/components/MyNewHeader'

interface VendorOrderDetailScreenProps {
  route: any
  navigation: any
}

const VendorOrderDetailScreen: React.FC<VendorOrderDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { order } = route.params
  const { theme } = useThemeStore()
  const colors = theme.colors
  // @ts-ignore
  const styles = makeStyles(colors)
  const { width } = useWindowDimensions()
  const updateStatusMutation = useUpdateOrderStatus()

  const [updateStatusVisible, setUpdateStatusVisible] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>(order.status)

  const statusOptions: Order['status'][] = ['pending', 'shipped', 'delivered', 'canceled']

  const handleUpdateStatus = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId: order.id,
        status: newStatus,
      })
      Alert.alert('Success', `Order status updated to ${newStatus}`)
      setUpdateStatusVisible(false)
      navigation.goBack()
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status')
    }
  }

  const handleContactBuyer = () => {
    // TODO: Implement contact buyer functionality
    Alert.alert('Contact', `Send message to ${order.user}`)
  }

  const handlePrintInvoice = () => {
    // TODO: Implement print invoice functionality
    Alert.alert('Print', 'Invoice printing feature coming soon')
  }

  const handleMarkShipped = () => {
    setNewStatus('shipped')
    setUpdateStatusVisible(true)
  }

  const handleMarkDelivered = () => {
    setNewStatus('delivered')
    setUpdateStatusVisible(true)
  }

  return (
    <View style={styles.container}>
      <MyNewHeader title="Order Details" withBackButton={true} vendor={true} subtitle='Full details for user order' />
      {/* Order Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig(order.status).color + '20' },
              ]}
            >
              <Icon
                name={statusConfig(order.status).icon as MaterialDesignIconsIconName}
                size={16}
                color={statusConfig(order.status).color}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: statusConfig(order.status).color },
                ]}
              >
                {statusConfig(order.status).label}
              </Text>
            </View>
          </View>
        </View>
      </Card>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={{ top: -40 }}
      >


        {/* Customer Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.infoRow}>
            <Icon name="account" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{order.user}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="email" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{order.user}@example.com</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>+91 9XXXXXXXXX</Text>
            </View>
          </View>
        </Card>

        {/* Product Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.productInfoContainer}>
            <View style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={2}>
                {order.part?.name || 'N/A'}
              </Text>
              <Text style={styles.productSku}>SKU: {order.part?.id || 'N/A'}</Text>

              <View style={styles.priceGrid}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Unit Price</Text>
                  <Text style={styles.priceValue}>₹{order.unitPrice}</Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Quantity</Text>
                  <Text style={styles.priceValue}>{order.quantity}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Order Summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.unitPrice * order.quantity}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>

          <Divider style={{ marginVertical: 12 }} />

          <View style={[styles.summaryRow, { marginBottom: 0 }]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{order.totalPrice}</Text>
          </View>
        </Card>

        {/* Payment Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.infoRow}>
            <Icon
              name="credit-card"
              size={20}
              color={colors.primary}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{order.paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon
              name="check-circle"
              size={20}
              color="#10b981"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Payment Status</Text>
              <Text style={[styles.infoValue, { color: '#10b981' }]}>Confirmed</Text>
            </View>
          </View>
        </Card>

        {/* Status Timeline */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.timeline}>
            {statusOptions.map((status, index) => {
              const isCompleted = statusOptions.indexOf(order.status) >= index
              const isCurrent = status === order.status
              return (
                <View key={status}>
                  <View style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        isCurrent && { backgroundColor: colors.primary, transform: [{ scale: 1.3 }] },
                        isCompleted && !isCurrent && { backgroundColor: '#10b981' },
                      ]}
                    >
                      {isCompleted && (
                        <Icon name="check" size={12} color="#fff" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isCurrent && { color: colors.primary, fontWeight: 'bold' },
                      ]}
                    >
                      {statusConfig(status).label}
                    </Text>
                  </View>
                  {index < statusOptions.length - 1 && (
                    <View
                      style={[
                        styles.timelineConnector,
                        isCompleted && !isCurrent && { backgroundColor: '#10b981' },
                      ]}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            mode="outlined"
            onPress={handleContactBuyer}
            style={styles.actionButton}
            icon="message"
          >
            Contact Buyer
          </Button>

          {order.status === 'pending' && (
            <Button
              mode="contained"
              onPress={handleMarkShipped}
              style={styles.actionButton}
              icon="truck"
            >
              Mark as Shipped
            </Button>
          )}

          {order.status === 'shipped' && (
            <Button
              mode="contained"
              onPress={handleMarkDelivered}
              style={styles.actionButton}
              icon="check-circle"
            >
              Mark as Delivered
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={handlePrintInvoice}
            style={styles.actionButton}
            icon="printer"
          >
            Print Invoice
          </Button>
        </View>
      </ScrollView>

      {/* Update Status Modal */}
      <Modal
        visible={updateStatusVisible}
        onDismiss={() => setUpdateStatusVisible(false)}
        contentContainerStyle={styles.modalContent}
      >
        <Text style={styles.modalTitle}>Update Order Status</Text>
        <Divider style={{ marginVertical: 12 }} />

        <Text style={styles.modalSubtitle}>
          Current Status: <Text style={{ fontWeight: 'bold' }}>{statusConfig(order.status).label}</Text>
        </Text>

        <View style={styles.statusOptionsContainer}>
          {statusOptions.filter(s => s !== order.status).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                newStatus === status && styles.statusOptionSelected,
              ]}
              onPress={() => setNewStatus(status)}
            >
              <Icon
                name={statusConfig(status).icon as MaterialDesignIconsIconName}
                size={22}
                color={newStatus === status ? '#fff' : statusConfig(status).color}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.statusOptionText,
                    newStatus === status && styles.statusOptionTextSelected,
                  ]}
                >
                  {statusConfig(status).label}
                </Text>
              </View>
              {newStatus === status && (
                <Icon name="check-circle" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={() => setUpdateStatusVisible(false)}
            disabled={updateStatusMutation.isPending}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleUpdateStatus}
            loading={updateStatusMutation.isPending}
            disabled={updateStatusMutation.isPending}
            style={{ flex: 1, marginLeft: 12 }}
          >
            Update
          </Button>
        </View>
      </Modal>
    </View>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    headerCard: {
      borderRadius: 12,
      padding: 16,
      margin: 16,
      marginBottom: 16,
      elevation: 2,
      top: -40
    },
    headerContent: {
      gap: 12,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    orderId: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    orderDate: {
      fontSize: 12,
      color: '#666',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    section: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    infoLabel: {
      fontSize: 12,
      color: '#999',
      fontWeight: '500',
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    productInfoContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
    },
    productDetails: {
      flex: 1,
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    productSku: {
      fontSize: 12,
      color: '#999',
      marginBottom: 8,
    },
    priceGrid: {
      flexDirection: 'row',
      gap: 8,
    },
    priceItem: {
      flex: 1,
    },
    priceLabel: {
      fontSize: 11,
      color: '#999',
      fontWeight: '500',
      marginBottom: 2,
    },
    priceValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.primary,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    summaryLabel: {
      fontSize: 13,
      color: '#666',
      fontWeight: '500',
    },
    summaryValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    timeline: {
      paddingHorizontal: 8,
    },
    timelineItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    timelineConnector: {
      width: 2,
      height: 24,
      backgroundColor: '#e5e7eb',
      marginLeft: 4,
    },
    timelineLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: '#999',
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#e5e7eb',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionsSection: {
      gap: 12,
      marginTop: 16,
    },
    actionButton: {
      marginHorizontal: 0,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      margin: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalSubtitle: {
      fontSize: 13,
      color: '#666',
      marginBottom: 16,
      fontWeight: '500',
    },
    statusOptionsContainer: {
      gap: 12,
      marginVertical: 16,
    },
    statusOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#e5e7eb',
      backgroundColor: '#fff',
    },
    statusOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    statusOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
    },
    statusOptionTextSelected: {
      color: '#fff',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
  })

export default VendorOrderDetailScreen

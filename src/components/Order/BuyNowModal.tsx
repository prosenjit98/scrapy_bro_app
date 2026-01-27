import React, { use, useState } from 'react'
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native'
import { Text, Button } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import Icon from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { useAuthStore } from '@/stores/authStore'

interface BuyNowModalProps {
  visible: boolean
  onDismiss: () => void
  onOrderSuccess?: () => void
  product: Part
  createOrderAsync?: (payload: any) => Promise<any>
  loading?: boolean
}

export const BuyNowModal = ({
  visible,
  onDismiss,
  onOrderSuccess,
  product,
  createOrderAsync,
  loading = false,
}: BuyNowModalProps) => {
  const theme = useThemeStore().theme
  const { user } = useAuthStore()
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD')
  const [deliveryAddress, setDeliveryAddress] = useState('')

  const imageUrl =
    product.images?.[0]
      ? typeof product.images[0] === 'string'
        ? product.images[0]
        : (product.images[0] as any)?.file?.url ?? (product.images[0] as any)?.url
      : null

  const handleConfirmOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Validation', 'Please enter delivery address')
      return
    }

    const payload = {
      vendorId: product.vendor?.id,
      userId: user?.id,
      totalPrice: product.price,
      quantity: 1,
      unitPrice: product.price,
    }

    try {
      if (createOrderAsync) {
        await createOrderAsync(payload)
        Alert.alert('Success', 'Order placed successfully!')
        onOrderSuccess?.()
        handleDismiss()
      }
    } catch (e) {
      console.warn('Order failed', e)
      Alert.alert('Error', 'Failed to place order. Please try again.')
    }
  }

  const handleDismiss = () => {
    setDeliveryAddress('')
    setPaymentMethod('COD')
    onDismiss()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <Text style={styles.modalSubtitle}>Complete your purchase</Text>
            </View>
            <TouchableOpacity onPress={handleDismiss} disabled={loading}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Product Summary */}
            <View style={styles.productSummary}>
              {imageUrl && (
                <FastImage
                  source={{ uri: imageUrl }}
                  style={styles.summaryImage}
                  resizeMode="cover"
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryTitle} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.summaryVendor}>{product.vendor?.fullName || 'Vendor'}</Text>
                <Text style={styles.summaryPrice}>₹{product.price?.toLocaleString?.() || product.price}</Text>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Method</Text>
              <View style={styles.paymentButtons}>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    paymentMethod === 'COD' && styles.paymentButtonActive,
                  ]}
                  onPress={() => setPaymentMethod('COD')}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.paymentButtonText,
                      paymentMethod === 'COD' && styles.paymentButtonTextActive,
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    paymentMethod === 'UPI' && styles.paymentButtonActive,
                  ]}
                  onPress={() => setPaymentMethod('UPI')}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.paymentButtonText,
                      paymentMethod === 'UPI' && styles.paymentButtonTextActive,
                    ]}
                  >
                    UPI
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Delivery Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your complete delivery address"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                editable={!loading}
              />
            </View>

            {/* Order Summary */}
            <View style={styles.orderSummary}>
              <Text style={styles.summaryHeader}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Product Price</Text>
                <Text style={styles.summaryValue}>₹{product.price?.toLocaleString?.() || product.price}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charges</Text>
                <Text style={[styles.summaryValue, { color: '#10b981' }]}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>Total Amount</Text>
                <Text style={styles.summaryTotalValue}>₹{product.price?.toLocaleString?.() || product.price}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              style={{ flex: 1 }}
              onPress={handleDismiss}
              disabled={loading}
            >
              Cancel
            </Button>
            <View style={{ width: 12 }} />
            <Button
              mode="contained"
              style={{ flex: 1 }}
              onPress={handleConfirmOrder}
              loading={loading}
              disabled={loading}
            >
              Confirm Order
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '90%',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      flex: 1
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111',
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 13,
      color: '#666',
    },
    modalBody: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    productSummary: {
      flexDirection: 'row',
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      gap: 12,
    },
    summaryImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    summaryTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111',
      marginBottom: 4,
    },
    summaryVendor: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    summaryPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: '#4f46e5',
    },
    modalSection: {
      marginBottom: 20,
    },
    modalSectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111',
      marginBottom: 12,
    },
    paymentButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    paymentButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    paymentButtonActive: {
      backgroundColor: '#4f46e5',
      borderColor: '#4f46e5',
    },
    paymentButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    paymentButtonTextActive: {
      color: '#fff',
    },
    addressInput: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: '#111',
      textAlignVertical: 'top',
      fontSize: 13,
    },
    orderSummary: {
      backgroundColor: '#eef2ff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    summaryHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 12,
      color: '#666',
    },
    summaryValue: {
      fontSize: 12,
      fontWeight: '500',
      color: '#111',
    },
    summaryDivider: {
      height: 1,
      backgroundColor: '#d1d5db',
      marginVertical: 8,
    },
    summaryTotal: {
      fontSize: 14,
      fontWeight: '700',
      color: '#111',
    },
    summaryTotalValue: {
      fontSize: 16,
      fontWeight: '800',
      color: '#4f46e5',
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
      backgroundColor: '#fff',
    },
  })

export default BuyNowModal

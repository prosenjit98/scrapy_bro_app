import React, { useState } from 'react'
import { View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native'
import { Card, Text, Modal, Button, Divider } from 'react-native-paper'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useGetVendorOrders, useUpdateOrderStatus } from '@/stores/hooks/useOrders'
import MyNewHeader from '@/components/MyNewHeader'
import { NoData } from '@/components/NoData'
import SkeletonBox from '@/components/SkeletonBox'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { AppTheme } from '@/theme'
import { statusConfig } from '@/constants'

interface VendorOrdersScreenProps {
  navigation: any
}

const VendorOrdersScreen: React.FC<VendorOrdersScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const colors = theme.colors
  // @ts-ignore
  const styles = makeStyles(colors)

  const { data: orders = [], isLoading, isFetching, refetch } = useGetVendorOrders(user?.id!)
  const updateStatusMutation = useUpdateOrderStatus()

  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [updateStatusVisible, setUpdateStatusVisible] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>('pending')

  const filters = ['All', 'pending', 'shipped', 'delivered', 'canceled']

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setUpdateStatusVisible(true)
  }

  const handleConfirmStatusUpdate = async () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      try {
        await updateStatusMutation.mutateAsync({
          orderId: selectedOrder.id,
          status: newStatus,
        })
        Alert.alert('Success', `Order status updated to ${newStatus}`)
        setUpdateStatusVisible(false)
        setSelectedOrder(null)
        refetch()
      } catch (error) {
        Alert.alert('Error', 'Failed to update order status')
      }
    } else {
      setUpdateStatusVisible(false)
      setSelectedOrder(null)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsVisible(true)
  }

  const handleNavigateToDetails = (order: Order) => {
    navigation.navigate('VendorOrderDetail', { order })
  }

  const statusOptions: Order['status'][] = ['pending', 'shipped', 'delivered', 'canceled']

  return (
    <View style={styles.container}>
      <MyNewHeader title="Orders" subtitle="Manage customer orders" withBackButton={true} vendor={true} />

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              filterStatus === filter && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === filter && styles.filterButtonTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <VendorOrderCard
              order={item}
              onViewDetails={() => handleViewDetails(item)}
              onUpdateStatus={() => handleUpdateStatus(item)}
              onNavigateToDetails={() => handleNavigateToDetails(item)}
              // @ts-ignore
              colors={colors}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={styles.listContent}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <NoData
              title="No Orders Yet"
              description="Orders from customers will appear here"
              onRetry={refetch}
              buttonLabel="Refresh"
            />
          }
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          <Modal
            visible={detailsVisible}
            onDismiss={() => setDetailsVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Order Details</Text>
            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID:</Text>
              <Text style={styles.detailValue}>{selectedOrder.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer:</Text>
              <Text style={styles.detailValue}>{selectedOrder.user}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Part/Product:</Text>
              <Text style={styles.detailValue}>{selectedOrder.part?.name || 'N/A'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantity:</Text>
              <Text style={styles.detailValue}>{selectedOrder.quantity}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Unit Price:</Text>
              <Text style={styles.detailValue}>₹{selectedOrder.unitPrice}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Price:</Text>
              <Text style={[styles.detailValue, { fontWeight: 'bold', color: colors.primary }]}>
                ₹{selectedOrder.totalPrice}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValue}>{selectedOrder.paymentMethod}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusConfig(selectedOrder.status).color + '20' },
                ]}
              >
                <Icon
                  name={statusConfig(selectedOrder.status).icon as MaterialDesignIconsIconName}
                  size={14}
                  color={statusConfig(selectedOrder.status).color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: statusConfig(selectedOrder.status).color },
                  ]}
                >
                  {statusConfig(selectedOrder.status).label}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setDetailsVisible(false)}
                style={{ flex: 1 }}
              >
                Close
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  setDetailsVisible(false)
                  handleUpdateStatus(selectedOrder)
                }}
                style={{ flex: 1, marginLeft: 8 }}
              >
                Update Status
              </Button>
            </View>
          </Modal>

          {/* Update Status Modal */}
          <Modal
            visible={updateStatusVisible}
            onDismiss={() => setUpdateStatusVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Update Order Status</Text>
            <Divider style={{ marginVertical: 12 }} />

            <Text style={styles.orderIdText}>Order ID: {selectedOrder.id}</Text>

            <View style={styles.statusOptionsContainer}>
              {statusOptions.map((status) => (
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
                    size={20}
                    color={newStatus === status ? '#fff' : statusConfig(status).color}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      newStatus === status && styles.statusOptionTextSelected,
                    ]}
                  >
                    {statusConfig(status).label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setUpdateStatusVisible(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirmStatusUpdate}
                loading={updateStatusMutation.isPending}
                disabled={updateStatusMutation.isPending}
                style={{ flex: 1, marginLeft: 8 }}
              >
                Confirm
              </Button>
            </View>
          </Modal>
        </>
      )}
    </View>
  )
}

interface VendorOrderCardProps {
  order: Order
  onViewDetails: () => void
  onUpdateStatus: () => void
  onNavigateToDetails: () => void
  colors: AppTheme['colors']
}

const VendorOrderCard: React.FC<VendorOrderCardProps> = ({
  order,
  onViewDetails,
  onUpdateStatus,
  onNavigateToDetails,
  colors,
}) => {
  // @ts-ignore
  const styles = makeStyles(colors)

  return (
    <Card style={styles.orderCard}>
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.customerName}>{order.user}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig(order.status).color + '20' },
            ]}
          >
            <Icon
              name={statusConfig(order.status).icon as MaterialDesignIconsIconName}
              size={14}
              color={statusConfig(order.status).color}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.statusText,
                { color: statusConfig(order.status).color },
              ]}
            >
              {statusConfig(order.status).label}
            </Text>
          </View>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        {/* Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Product</Text>
            <Text style={styles.detailItemValue} numberOfLines={2}>
              {order.part?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Quantity</Text>
            <Text style={styles.detailItemValue}>{order.quantity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Total</Text>
            <Text style={[styles.detailItemValue, { color: colors.primary, fontWeight: 'bold' }]}>
              ₹{order.totalPrice}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailItemLabel}>Date</Text>
            <Text style={styles.detailItemValue}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onViewDetails}>
            <Icon name="eye" size={18} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Quick View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onUpdateStatus}>
            <Icon name="pencil" size={18} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* More Details Button */}
        <TouchableOpacity style={styles.moreDetailsButton} onPress={onNavigateToDetails}>
          <Icon name="information" size={18} color={colors.vendorPrimary} style={{ marginRight: 6 }} />
          <Text style={[styles.moreDetailsText, { color: colors.vendorPrimary }]}>More Details</Text>
          <Icon name="chevron-right" size={18} color={colors.vendorPrimary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </Card>
  )
}

const LoadingSkeleton = () => {
  return (
    <View style={{ padding: 16 }}>
      {[1, 2, 3].map((i) => (
        <Card key={i} style={{ marginVertical: 8, padding: 16, borderRadius: 10 }}>
          <SkeletonBox width="60%" height={20} borderRadius={8} />
          <SkeletonBox width="40%" height={20} borderRadius={8} />
          <SkeletonBox width="80%" height={20} />
        </Card>
      ))}
    </View>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    filterContainer: {
      backgroundColor: '#fff',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
      marginHorizontal: 16,
      borderRadius: 8,
      marginTop: -25,
      flexGrow: 0,
      minHeight: 55
    },
    filterContentContainer: {
      paddingHorizontal: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: '#f3f4f6',
      marginRight: 8,
    },
    filterButtonActive: {
      backgroundColor: colors.vendorPrimary,
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
    },
    filterButtonTextActive: {
      color: '#fff',
    },
    listContent: {
      padding: 16,
    },
    orderCard: {
      borderRadius: 12,
      elevation: 2,
      marginBottom: 8,
    },
    cardContent: {
      padding: 16,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    orderId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    customerName: {
      fontSize: 13,
      color: '#666',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    detailItem: {
      flex: 1,
      minWidth: '45%',
    },
    detailItemLabel: {
      fontSize: 11,
      color: '#999',
      fontWeight: '500',
      marginBottom: 4,
    },
    detailItemValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
    },
    moreDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.vendorPrimary + '10',
      marginTop: 12,
    },
    moreDetailsText: {
      fontSize: 13,
      fontWeight: '700',
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
      color: '#000',
    },
    orderIdText: {
      fontSize: 13,
      color: '#666',
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    detailLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#666',
    },
    detailValue: {
      fontSize: 13,
      color: colors.text,
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
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#e5e7eb',
      backgroundColor: '#fff',
    },
    statusOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    statusOptionText: {
      fontSize: 13,
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

export default VendorOrdersScreen

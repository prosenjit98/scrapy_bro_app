import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import MyNewHeader from '@/components/MyNewHeader'
import { useAuthStore } from '@/stores/authStore'
import { useGetUserOrders } from '@/stores/hooks/useOrders'
import { Card } from 'react-native-paper'
import SkeletonBox from '@/components/SkeletonBox'
import { NoData } from '@/components/NoData'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import { StyleSheet } from 'react-native'
import TrackingModal from '@/components/Order/TrackingModel'
import RatingModal from '@/components/Order/RatingsModel'
import ContactModal from '@/components/Order/ContantModel'
import OrderRow from '@/components/Order/OrderRow'


const UserOrdersScreen = () => {
  const { user } = useAuthStore()
  const { colors } = useThemeStore().theme
  //@ts-ignore
  const styles = makeStyles(colors)
  const { data: orders, isLoading, refetch, isFetching } = useGetUserOrders(user?.id!)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [ratingModalVisible, setRatingModalVisible] = useState(false)
  const [trackingModalVisible, setTrackingModalVisible] = useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  const filters = ['All', 'Pending', 'Shipped', 'Delivered', 'Canceled']

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders?.filter(o => o.status.toLowerCase().includes(filterStatus.toLowerCase()))

  const handleRateVendor = (order: Order) => {
    setSelectedOrder(order)
    setRatingModalVisible(true)
  }

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order)
    setTrackingModalVisible(true)
  }

  const handleContactVendor = (order: Order) => {
    setSelectedOrder(order)
    setContactModalVisible(true)
  }

  const handleSubmitRating = ({ rating, review, order }: any) => {
    console.log('Review submitted:', { rating, review, orderId: order.id })
    Alert.alert('Thank you for your review!')
    setRatingModalVisible(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MyNewHeader title="My Orders" subtitle="Track your purchases" withBackButton={true} />

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
              {filter}
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
            <OrderRow
              item={item}
              onPress={() => { }}
              onTrack={handleTrackOrder}
              onContact={handleContactVendor}
              onRate={handleRateVendor}
            />
          )}
          keyExtractor={(item: Order) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ padding: 16 }}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <NoData
              title="No Orders Yet"
              description="Please start shopping"
              onRetry={refetch}
              buttonLabel="Refresh"
            />
          }
        />
      )}

      {/* Modals */}
      {selectedOrder && (
        <>
          <RatingModal
            visible={ratingModalVisible}
            order={selectedOrder}
            onDismiss={() => setRatingModalVisible(false)}
            onSubmit={handleSubmitRating}
          />
          <TrackingModal
            visible={trackingModalVisible}
            order={selectedOrder}
            onDismiss={() => setTrackingModalVisible(false)}
          />
          <ContactModal
            visible={contactModalVisible}
            order={selectedOrder}
            onDismiss={() => setContactModalVisible(false)}
          />
        </>
      )}
    </View>
  )
}

const LoadingSkeleton = () => {
  return (
    <View style={{ padding: 16 }}>
      {[1, 2, 3].map((i) => (
        <Card key={i} style={{ marginVertical: 8, padding: 16, borderRadius: 10 }}>
          <SkeletonBox width="60%" height={20} />
          <SkeletonBox width="40%" height={20} />
          <SkeletonBox width="80%" height={20} />
        </Card>
      ))}
    </View>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    filterContainer: {
      backgroundColor: '#fff',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
      marginHorizontal: 16,
      borderRadius: 8,
      marginTop: -25,
      flexGrow: 0,
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
      backgroundColor: '#4f46e5',
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
    },
    filterButtonTextActive: {
      color: '#fff',
    }
  })

export default UserOrdersScreen
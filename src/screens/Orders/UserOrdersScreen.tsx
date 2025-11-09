import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import { useAuthStore } from '@/stores/authStore'
import { useGetUserOrders } from '@/stores/hooks/useOrders'
import { Card, Chip, Button, Divider } from 'react-native-paper'
import SkeletonBox from '@/components/SkeletonBox'
import { NoData } from '@/components/NoData'
import { formatDate } from '@/utility/format'

const statusColor = (status: Order['status']) => {
  switch (status) {
    case 'completed': return 'green'
    case 'canceled': return 'red'
    case 'pending': return 'orange'
    default: return 'gray'
  }
}

// const formatDate = (d?: string | Date) => {
//   if (!d) return ''
//   const date = typeof d === 'string' ? new Date(d) : d
//   return date.toLocaleDateString() + ' • ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// }

const OrderRow = ({ item, onPress }: { item: Order; onPress: (o: Order) => void }) => {
  return (
    <Card style={{ marginVertical: 8, borderRadius: 10 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.vendor}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>{`Order #${String(item.id).slice(0, 8)}`}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>₹{item.totalPrice?.toFixed(2)}</Text>
            <Chip style={{ marginTop: 8, backgroundColor: statusColor(item.status) }} textStyle={{ color: '#fff' }}>
              {item.status.toUpperCase()}
            </Chip>
          </View>
        </View>

        <Divider style={{ marginVertical: 10 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#444' }}>{`${item.quantity} item${item.quantity > 1 ? 's' : ''} • Unit ₹${(item.unitPrice ?? item.price)?.toFixed(2)}`}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button compact onPress={() => onPress(item)}>View</Button>
            <Button compact onPress={() => {/* implement reorder */ }} disabled={item.status === 'pending'}>Reorder</Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

const UserOrdersScreen = () => {
  const { user } = useAuthStore()
  const { data: orders, isLoading, refetch, isFetching } = useGetUserOrders(user?.id!);

  const handlePress = (order: Order) => {
    // navigate to order details
    // navigation.navigate('OrderDetails', { orderId: order.id })
  }


  return (
    <MyFlatListLayout hasProfileLink={true} withBackButton={true} moduleName="My Orders">
      {
        isLoading ? (<LoadingSkeleton />) : (
          <View style={{ flex: 1, justifyContent: 'flex-start', padding: 16 }}>
            <FlatList
              data={orders}
              renderItem={({ item }) => <OrderRow item={item} onPress={handlePress} />}
              keyExtractor={(item: Order) => item.id}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              refreshing={isFetching}
              onRefresh={refetch}
              ListEmptyComponent={<NoData
                title="No Orders Yet"
                description="Please start shopping"
                onRetry={refetch}
                buttonLabel="Refresh"
              />}
            />
          </View>
        )
      }
    </MyFlatListLayout>
  )
}


const LoadingSkeleton = () => {
  return (
    <>
      <Card style={{ marginVertical: 8, padding: 16, borderRadius: 10 }}>
        <SkeletonBox width="60%" height={20} />
        <SkeletonBox width="40%" height={20} />
        <SkeletonBox width="80%" height={20} />
      </Card>
      <Card style={{ marginVertical: 8, padding: 16, borderRadius: 10 }}>
        <SkeletonBox width="60%" height={20} />
        <SkeletonBox width="40%" height={20} />
        <SkeletonBox width="80%" height={20} />
      </Card>
      <Card style={{ marginVertical: 8, padding: 16, borderRadius: 10 }}>
        <SkeletonBox width="60%" height={20} />
        <SkeletonBox width="40%" height={20} />
        <SkeletonBox width="80%" height={20} />
      </Card>
    </>

  )
}

export default UserOrdersScreen
import React from 'react'
import { FlatList, TouchableOpacity, Text, View } from 'react-native'
import { ActivityIndicator, Card, FAB } from 'react-native-paper'
import { NoData } from '@/components/NoData'
import { useVendorProposals } from '@/stores/hooks/useProposals'
import { useAuthStore } from '@/stores/authStore'
import MyHeader from '@/components/MyHeader'
import SkeletonBox from '@/components/SkeletonBox'

const ProposalListScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { data, isLoading, refetch } = useVendorProposals(user?.id!)

  if (isLoading) {
    return (
      <Card>
        <View style={{ padding: 16 }}>
          <SkeletonBox height={20} width="60%" />
          <SkeletonBox height={10} width="90%" />
          <SkeletonBox height={10} width="90%" />
          <SkeletonBox height={10} width="90%" />
        </View>
      </Card>
    )
  }

  console.log(data)


  return (
    <>
      <MyHeader hasProfileLink={true} />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={refetch}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProposalDetails', { proposalId: item.id })}>
            <Card style={{ margin: 8, borderRadius: 10 }}>
              <Card.Content>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.vendor?.name}</Text>
                <Text style={{ color: 'gray', marginVertical: 4 }}>
                  {item.message || 'No message provided'}
                </Text>
                <Text style={{ fontWeight: 'bold', color: '#2a9d8f' }}>₹ {item.amount}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<NoData
          title="No proposals yet"
          description="Sorry no user have been sent any proposal yet."
          onRetry={refetch}
          buttonLabel="Refresh"
        />}
      />

      <FAB
        icon="switch"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
        }}
        onPress={() => navigation.navigate('Root')}
      />

    </>
  )
}

export default ProposalListScreen

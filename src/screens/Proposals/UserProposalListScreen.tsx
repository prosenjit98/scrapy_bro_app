import React from 'react'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import { Card } from 'react-native-paper'

import { useUserProposals } from '@/stores/hooks/useProposals'
import { NoData } from '@/components/NoData'
import SkeletonBox from '@/components/SkeletonBox'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'

interface UserProposalListScreenProps {
  inquiryId: number;
  // navigation: any;
}

const UserProposalListScreen: React.FC<UserProposalListScreenProps> = ({ inquiryId }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();
  const { data, isLoading } = useUserProposals(inquiryId)

  if (!data?.length) return <NoData title="No proposals yet" description="Sorry No vendor have been sent any proposal yet" />

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

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => { navigation.navigate('ProposalDetails', { proposalId: item.id }) }}>
          <Card style={{ margin: 8, borderRadius: 10 }}>
            <Card.Content>
              <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.proposer.fullName}</Text>
              <Text style={{ color: 'gray', marginVertical: 4 }}>
                {item.description || 'No message provided'}
              </Text>
              <Text style={{ fontWeight: 'bold', color: '#2a9d8f' }}>₹ {item.price}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      )}
    />
  )
}
export default UserProposalListScreen

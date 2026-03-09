import React, { useState } from 'react'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import { Card, Button, IconButton } from 'react-native-paper'

import { useUserProposals } from '@/stores/hooks/useProposals'
import { NoData } from '@/components/NoData'
import SkeletonBox from '@/components/SkeletonBox'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types/navigation'
import ProposalChatModal from '@/components/Proposal/ProposalChatModal'
import Icon from '@react-native-vector-icons/material-design-icons'

interface UserProposalListScreenProps {
  inquiryId: number;
  // navigation: any;
}

const UserProposalListScreen: React.FC<UserProposalListScreenProps> = ({ inquiryId }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Root'>>();
  const { data, isLoading, refetch } = useUserProposals(inquiryId)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [chatModalVisible, setChatModalVisible] = useState(false)

  const handleOpenChat = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    setChatModalVisible(true)
  }

  const handleCloseChat = () => {
    setChatModalVisible(false)
    setSelectedProposal(null)
    refetch() // Refresh proposals after chat
  }

  const handleProposalAccepted = () => {
    refetch() // Refresh the list when a proposal is accepted
  }

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
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card style={{ margin: 8, borderRadius: 10 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.proposer?.fullName || item.vendor?.fullName}</Text>
                  <Text style={{ color: 'gray', marginVertical: 4 }} numberOfLines={2}>
                    {item.description || 'No message provided'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <Text style={{ fontWeight: 'bold', color: '#2a9d8f', fontSize: 16 }}>₹ {item.price}</Text>
                    {item.comments && item.comments.length > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name="message-text" size={14} color="#666" />
                        <Text style={{ fontSize: 12, color: '#666' }}>{item.comments.length}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Status Indicator */}
                {item.isSelfAccepted && item.isOtherAccepted && (
                  <View style={{ backgroundColor: '#10b98120', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, color: '#10b981', fontWeight: '600' }}>Accepted</Text>
                  </View>
                )}
                {(item.isSelfAccepted === false || item.isOtherAccepted === false) && (
                  <View style={{ backgroundColor: '#ef444420', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, color: '#ef4444', fontWeight: '600' }}>Rejected</Text>
                  </View>
                )}
                {item.isOtherAccepted === true && item.isSelfAccepted === null && (
                  <View style={{ backgroundColor: '#f59e0b20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, color: '#f59e0b', fontWeight: '600' }}>Waiting for Vendor</Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <Button
                  mode="outlined"
                  onPress={() => handleOpenChat(item)}
                  style={{ flex: 1 }}
                  icon="message"
                  compact
                >
                  Chat
                </Button>
                <Button
                  mode="text"
                  onPress={() => { navigation.navigate('ProposalDetails', { proposalId: item.id }) }}
                  compact
                >
                  Details
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      {/* Chat Modal */}
      {selectedProposal && (
        <ProposalChatModal
          visible={chatModalVisible}
          onDismiss={handleCloseChat}
          proposal={selectedProposal}
          onProposalAccepted={handleProposalAccepted}
        />
      )}
    </>
  )
}
export default UserProposalListScreen

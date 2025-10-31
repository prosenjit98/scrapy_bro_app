import React from 'react'
import { View, Text, ScrollView, Button, FlatList } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import { useGetProposal } from '@/stores/hooks/useProposals'
import { NoData } from '@/components/NoData'
import ProposalSkeleton from '@/components/Proposal/InquirySkeleton'
import ProposalCard from '@/components/Proposal/ProposalCard'
import Row from '@/components/Row'
import { Card } from 'react-native-paper'
// import { api } from '@/services/apiClient'


const ProposalDetailsScreen = ({ route }: any) => {
  const { proposalId } = route.params
  const { data: proposal, refetch, isPending } = useGetProposal(proposalId)

  const handleStatus = async (status: 'accepted' | 'rejected') => {
    try {
      // await api.put(`/proposals/${proposalId}/status`, { status })
      // showSnackbar(`Proposal ${status}`, 'success')
      refetch()
    } catch (e) {
      // showSnackbar('Error updating proposal status', 'error')
    }
  }



  return (
    <MyFlatListLayout hasProfileLink={true} withBackButton={true} moduleName="Proposal Details">
      {isPending ? <ProposalSkeleton /> : <>
        {!proposal ? <NoData title="Cannot fetch data" description="Sorry server is unreachable we are not able to pull data from server" /> :
          <View style={{ flexGrow: 1, padding: 16, paddingTop: 12, justifyContent: 'flex-start' }}>
            <ProposalCard item={proposal} />
            <FlatList
              data={proposal.comments}
              keyExtractor={(item: Comment) => item.id.toString()}
              refreshing={isPending}
              onRefresh={refetch}
              renderItem={({ item }: { item: Comment }) => (
                <Card style={{ margin: 8, borderRadius: 10 }}>
                  <Card.Content>
                    <Text style={{ fontWeight: '600', fontSize: 16, marginVertical: 10 }}>{item.commenter.fullName}</Text>
                    <Text style={{ fontSize: 12 }}>{item.message}</Text>
                  </Card.Content>
                </Card>
              )}
              ListEmptyComponent={<NoData
                title="No Comment Yet"
                description="Please start conversation"
                onRetry={refetch}
                buttonLabel="Refresh"
              />}
            />

            <Row style={{ justifyContent: 'space-around', marginVertical: 20 }}>
              <Button title="Accept" color="#2a9d8f" onPress={() => handleStatus('accepted')} />
              <Button title="Reject" color="#e63946" onPress={() => handleStatus('rejected')} />
            </Row>
          </View>
        }</>}
    </MyFlatListLayout>
  )
}


export default ProposalDetailsScreen 
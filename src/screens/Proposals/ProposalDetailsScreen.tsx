import React from 'react'
import { View, Text, ScrollView, Button, FlatList } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import { useCreateComment, useGetProposal } from '@/stores/hooks/useProposals'
import { NoData } from '@/components/NoData'
import ProposalSkeleton from '@/components/Proposal/InquirySkeleton'
import ProposalCard from '@/components/Proposal/ProposalCard'
import Row from '@/components/Row'
import { Card } from 'react-native-paper'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '@/validation/proposalSchemas'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { ChatInput } from '@/components/ChatInput'
import MessageBubble from '@/components/Proposal/MessageBubble'
// import { api } from '@/services/apiClient'

export type commentSchemaType = z.infer<typeof commentSchema>

const ProposalDetailsScreen = ({ route }: any) => {
  const { proposalId } = route.params
  const { user } = useAuthStore()
  const { data: proposal, refetch, isPending } = useGetProposal(proposalId)
  const { mutate: createComment, isPending: loadingComment } = useCreateComment({ proposalId })
  const showSnackbar = useSnackbarStore.getState().showSnackbar

  const { control, handleSubmit, reset } = useForm<commentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: { proposalId: proposalId, content: '', userId: user?.id },
  })

  const handleCreateComment = async (data: any) => {
    try {
      createComment({ id: proposalId, formData: data })
      showSnackbar('Comment added successfully', 'success')
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error submitting comment', 'error')
    }
  }

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
          <View style={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <ProposalCard
                item={proposal}
                actionButton={() => <Row style={{ justifyContent: 'space-around', marginVertical: 20 }}>
                  <Button title="Accept" color="#2a9d8f" onPress={() => handleStatus('accepted')} />
                  <Button title="Reject" color="#e63946" onPress={() => handleStatus('rejected')} />
                </Row>}
              />
              <FlatList
                data={proposal.comments}
                keyExtractor={(item: Comment) => item.id.toString()}
                refreshing={isPending}
                onRefresh={refetch}
                renderItem={({ item }: { item: Comment }) => (
                  <MessageBubble message={item} />
                )}
                ListEmptyComponent={<NoData
                  title="No Comment Yet"
                  description="Please start conversation"
                  onRetry={refetch}
                  buttonLabel="Refresh"
                />}
              />
            </View>

            <View style={{ marginBottom: 40 }}>
              <ChatInput
                name='content'
                onSend={handleSubmit(handleCreateComment)}
                isLoading={loadingComment}
                control={control}
                reset={reset}
              />
            </View>

          </View>
        }</>}
    </MyFlatListLayout>
  )
}


export default ProposalDetailsScreen 
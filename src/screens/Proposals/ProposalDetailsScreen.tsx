import React, { useState } from 'react'
import { View, Text, Button, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import { useCreateComment, useGetProposal, useUpdateStatus } from '@/stores/hooks/useProposals'
import { NoData } from '@/components/NoData'
import ProposalSkeleton from '@/components/Proposal/InquirySkeleton'
import ProposalCard from '@/components/Proposal/ProposalCard'
import Row from '@/components/Row'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '@/validation/proposalSchemas'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { ChatInput } from '@/components/ChatInput'
import MessageBubble from '@/components/Proposal/MessageBubble'
import { Portal } from 'react-native-paper'
import CreateOrderModal from '@/components/Order/CreateOrderModal'
import { useCreateOrder } from '@/stores/hooks/useOrders' // optional if you have it
// import { api } from '@/services/apiClient'

export type commentSchemaType = z.infer<typeof commentSchema>

const ProposalDetailsScreen = ({ route }: any) => {
  const { proposalId } = route.params
  const { user } = useAuthStore()
  const { data: proposal, refetch, isPending } = useGetProposal(proposalId)
  const { mutate: createComment, isPending: loadingComment } = useCreateComment({ proposalId })
  const { mutate: updateStatus } = useUpdateStatus({ proposalId })
  const showSnackbar = useSnackbarStore.getState().showSnackbar
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'accept' | 'reject' | null>(null)
  const [price, setPrice] = useState('')

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


  const handleStatus = async (status: 'accepted' | 'rejected', payload?: any) => {
    try {
      // send additional payload (e.g. price) when accepting
      let modified_status = status === 'accepted' ? true : false
      updateStatus({ is_accepted: modified_status, ...payload })
    } catch (e) {
      showSnackbar('Error updating proposal status', 'error')
    }
  }

  const openModal = (type: 'accept' | 'reject') => {
    setModalType(type)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalType(null)
    setPrice('')
  }

  const confirmModal = () => {
    if (modalType === 'accept') {
      const parsed = parseFloat(price)
      if (isNaN(parsed) || parsed <= 0) {
        showSnackbar('Please enter a valid price', 'error')
        return
      }
      handleStatus('accepted', { price: parsed })
      closeModal()
    } else if (modalType === 'reject') {
      handleStatus('rejected')
      closeModal()
    }
  }

  const [orderModalVisible, setOrderModalVisible] = useState(false)
  const { mutateAsync: createOrderAsync, isPending: creatingOrder } = useCreateOrder()

  const openCreateOrder = () => setOrderModalVisible(true)
  const closeCreateOrder = () => setOrderModalVisible(false)

  const createOrderHandler = async (payload: any) => {
    // If you have a hook: useCreateOrder
    if (createOrderAsync) {
      await createOrderAsync({
        userId: payload.userId,
        proposalId: payload.proposalId,
        totalPrice: payload.totalPrice,
        quantity: payload.quantity,
        unitPrice: payload.unitPrice,
        vendorId: payload.vendorId,
      })
      // optionally refetch orders/proposal after success
      refetch()
      showSnackbar('Order created', 'success')
      return
    }
    showSnackbar('Create Order not wired to API - implement onSubmit', 'info')
  }

  const createOrder = async () => {
    // open modal instead of placeholder
    openCreateOrder()
  }

  return (
    <MyFlatListLayout hasProfileLink={true} withBackButton={true} moduleName="Proposal Details">
      {isPending ? <ProposalSkeleton /> : <>
        {!proposal ? <NoData title="Cannot fetch data" description="Sorry server is unreachable we are not able to pull data from server" /> :
          <View style={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>

              <ProposalCard
                item={proposal}
                actionButton={() => {
                  if (!proposal.isAccepted && ((proposal.inquiryId && user?.id === proposal.proposerId) || (user?.id === proposal.vendorId))) {
                    return (
                      <Row style={{ justifyContent: 'space-around', marginVertical: 20 }}>
                        <Button title="Accept" color="#2a9d8f" onPress={() => openModal('accept')} />
                        <Button title="Reject" color="#e63946" onPress={() => openModal('reject')} />
                      </Row>
                    )
                  }
                  if (proposal.isAccepted && ((proposal.inquiryId && user?.id !== proposal.proposerId) || (user?.id === proposal.vendorId))) {
                    return (
                      <View style={{ borderRadius: 8, marginTop: 4, overflow: 'hidden' }}>
                        <Button title="Create Order" color="#2a9d8f" onPress={createOrder} />
                      </View>
                    )
                  }
                  return null
                }}
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

            {/* Modal for accept/reject */}
            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal} onDismiss={closeModal}>
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                  {modalType === 'accept' ? (
                    <>
                      <Text style={styles.modalTitle}>Accept Proposal</Text>
                      <Text style={styles.modalText}>Enter price to accept the proposal</Text>
                      <TextInput
                        value={price}
                        onChangeText={setPrice}
                        placeholder="Price"
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.modalTitle}>Reject Proposal</Text>
                      <Text style={styles.modalText}>Are you sure you want to reject this proposal? This action cannot be undone.</Text>
                    </>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    <TouchableOpacity onPress={closeModal} style={[styles.btn, styles.btnCancel]}>
                      <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={confirmModal} style={[styles.btn, styles.btnConfirm]}>
                      <Text style={[styles.btnText, { color: '#fff' }]}>{modalType === 'accept' ? 'Confirm & Send' : 'Confirm Reject'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <CreateOrderModal
              visible={orderModalVisible}
              onDismiss={closeCreateOrder}
              defaultValues={{ proposalId: proposalId, unitPrice: proposal?.price ? String(proposal.price) : undefined }}
              onSubmit={createOrderHandler}
              loading={creatingOrder}
            />
          </View>
        }</>}
    </MyFlatListLayout>
  )
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#333', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#f1f1f1',
  },
  btnConfirm: {
    backgroundColor: '#2a9d8f',
  },
  btnText: { color: '#333', fontWeight: '600' },
})

export default ProposalDetailsScreen
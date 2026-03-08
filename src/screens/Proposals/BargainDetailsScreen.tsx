import React, { useState } from 'react'
import { View, Text, Button, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import MyFlatListLayout from '@/components/MyFlatListLayout'
import { useGetBargain, useCreateBargainComment, useUpdateBargainStatus } from '@/stores/hooks/useBargains'
import { NoData } from '@/components/NoData'
import ProposalSkeleton from '@/components/Proposal/InquirySkeleton'
import Row from '@/components/Row'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '@/validation/proposalSchemas'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { ChatInput } from '@/components/ChatInput'
import MessageBubble from '@/components/Proposal/MessageBubble'
import CreateOrderModal from '@/components/Order/CreateOrderModal'
import { useCreateOrder } from '@/stores/hooks/useOrders'
import BargainingCard from '@/components/Proposal/BargainingCard'
import MyNewHeader from '@/components/MyNewHeader'

export type commentSchemaType = z.infer<typeof commentSchema>

const BargainDetailsScreen = ({ route }: any) => {
  const { bargainId } = route.params
  const { user } = useAuthStore()
  const { data: bargain, refetch, isPending } = useGetBargain(bargainId)
  const { mutate: createComment, isPending: loadingComment } = useCreateBargainComment({ bargainId })
  const { mutate: updateStatus } = useUpdateBargainStatus({ bargainId })
  const showSnackbar = useSnackbarStore.getState().showSnackbar
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'accept' | 'reject' | null>(null)
  const [price, setPrice] = useState('')

  const { control, handleSubmit, reset } = useForm<commentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: { bargainId, content: '', userId: user?.id },
  })

  const handleCreateComment = async (data: any) => {
    try {
      createComment({ id: bargainId, formData: data })
      showSnackbar('Comment added successfully', 'success')
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error submitting comment', 'error')
    }
  }

  const handleStatus = async (status: 'accepted' | 'rejected', payload?: any) => {
    try {
      let modified_status = status === 'accepted' ? true : false
      if (user?.id === bargain?.proposerId)
        updateStatus({ is_self_accepted: modified_status, ...payload })
      else if (user?.id === bargain?.vendorId)
        updateStatus({ is_other_accepted: modified_status, ...payload })
    } catch (e) {
      showSnackbar('Error updating bargain status', 'error')
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
    if (createOrderAsync) {
      await createOrderAsync({
        userId: payload.userId,
        bargainId: bargainId,
        totalPrice: payload.totalPrice,
        quantity: payload.quantity,
        unitPrice: payload.unitPrice,
        vendorId: payload.vendorId,
        orderableType: 'bargains',
        orderableId: bargainId,
      })
      refetch()
      showSnackbar('Order created', 'success')
      return
    }
    showSnackbar('Create Order not wired to API - implement onSubmit', 'info')
  }

  const createOrder = async () => {
    openCreateOrder()
  }

  const actionButton = () => {
    if (!bargain) return null
    if ((bargain.isSelfAccepted === null && (user?.id === bargain.proposerId)) || (user?.id === bargain.vendorId)) {
      return (
        <Row style={{ justifyContent: 'space-around', marginVertical: 10 }}>
          <Button title="Accept" color="#2a9d8f" onPress={() => openModal('accept')} />
          <Button title="Reject" color="#e63946" onPress={() => openModal('reject')} />
        </Row>
      )
    }
    if ((bargain.isSelfAccepted && !bargain.isOtherAccepted) || (!bargain.isSelfAccepted && bargain.isOtherAccepted)) {
      return (
        <View style={{ borderRadius: 8, marginTop: 4, overflow: 'hidden' }}>
          <Text style={{ alignSelf: 'center', marginVertical: 10, color: '#ffb703', fontWeight: '600' }}>Waiting for other party to respond</Text>
        </View>
      )
    } else if (bargain.isSelfAccepted && bargain.isOtherAccepted && ((user?.id !== bargain.proposerId) || (user?.id === bargain.vendorId))) {
      return (
        <View style={{ borderRadius: 8, marginTop: 4, overflow: 'hidden' }}>
          <Button title="Create Order" color="#2a9d8f" onPress={createOrder} />
        </View>
      )
    }
    return null
  }

  return (
    <View style={[styles.container]}>
      <MyNewHeader withBackButton={true} title="Bargain Details" subtitle={bargain && `Bargain #${bargain?.id}`} />
      {isPending ? <ProposalSkeleton /> : <>
        {!bargain ? <NoData title="Cannot fetch data" description="Sorry server is unreachable we are not able to pull data from server" /> :
          <View style={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={{ paddingHorizontal: 8, marginBottom: 8, top: -40 }}>
                <BargainingCard item={bargain} actionButton={actionButton} />
              </View>

              <FlatList
                data={bargain.comments}
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
                      <Text style={styles.modalTitle}>Accept Bargain</Text>
                      <Text style={styles.modalText}>Enter price to accept the bargain</Text>
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
                      <Text style={styles.modalTitle}>Reject Bargain</Text>
                      <Text style={styles.modalText}>Are you sure you want to reject this bargain? This action cannot be undone.</Text>
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
              defaultValues={{ bargainId: bargainId, unitPrice: bargain?.price ? String(bargain.price) : undefined }}
              onSubmit={createOrderHandler}
              loading={creatingOrder}
            />
          </View>
        }</>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
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

export default BargainDetailsScreen

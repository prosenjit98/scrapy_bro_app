import React, { useState } from 'react'
import {
  View,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Text, Divider, Button, ActivityIndicator } from 'react-native-paper'
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { AppTheme } from '@/theme'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '@/validation/proposalSchemas'
import { z } from 'zod'
import { useCreateComment, useGetProposal, useUpdateStatus } from '@/stores/hooks/useProposals'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { ChatInput } from '@/components/ChatInput'
import MessageBubble from '@/components/Proposal/MessageBubble'
import { NoData } from '@/components/NoData'

interface ProposalChatModalProps {
  visible: boolean
  onDismiss: () => void
  proposal: Proposal
  onProposalAccepted?: () => void
}

export type commentSchemaType = z.infer<typeof commentSchema>

const ProposalChatModal: React.FC<ProposalChatModalProps> = ({
  visible,
  onDismiss,
  proposal: initialProposal,
  onProposalAccepted,
}) => {
  const { theme } = useThemeStore()
  const colors = theme.colors
  const { user } = useAuthStore()
  // @ts-ignore
  const styles = makeStyles(colors)
  const showSnackbar = useSnackbarStore.getState().showSnackbar

  const { data: proposal, refetch, isPending } = useGetProposal(initialProposal.id)
  const { mutate: createComment, isPending: loadingComment } = useCreateComment({ proposalId: initialProposal.id })
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateStatus({ proposalId: initialProposal.id })

  const [acceptModalVisible, setAcceptModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)

  const { control, handleSubmit, reset } = useForm<commentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: { proposalId: initialProposal.id, content: '', userId: user?.id },
  })

  const currentProposal = proposal || initialProposal

  const handleCreateComment = async (data: any) => {
    try {
      createComment(
        { id: currentProposal.id, formData: data },
        {
          onSuccess: () => {
            showSnackbar('Message sent successfully', 'success')
            reset()
            refetch()
          },
          onError: (err: any) => {
            showSnackbar(err.response?.data?.message || 'Error sending message', 'error')
          },
        }
      )
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error sending message', 'error')
    }
  }

  const handleAcceptProposal = () => {
    if (user?.id !== currentProposal.proposerId) {
      Alert.alert('Error', 'Only the inquiry creator can accept proposals')
      return
    }

    setAcceptModalVisible(true)
  }

  const confirmAcceptProposal = () => {
    try {
      const modified_status = true
      updateStatus(
        { is_self_accepted: modified_status, price: currentProposal.price },
        {
          onSuccess: () => {
            showSnackbar('Proposal accepted successfully!', 'success')
            setAcceptModalVisible(false)
            refetch()
            onProposalAccepted?.()
          },
          onError: (err: any) => {
            showSnackbar(err.response?.data?.message || 'Error accepting proposal', 'error')
          },
        }
      )
    } catch (e) {
      showSnackbar('Error accepting proposal', 'error')
    }
  }

  const handleRejectProposal = () => {
    setRejectModalVisible(true)
  }

  const confirmRejectProposal = () => {
    try {
      const modified_status = false
      updateStatus(
        { is_self_accepted: modified_status },
        {
          onSuccess: () => {
            showSnackbar('Proposal rejected', 'success')
            setRejectModalVisible(false)
            refetch()
          },
          onError: (err: any) => {
            showSnackbar(err.response?.data?.message || 'Error rejecting proposal', 'error')
          },
        }
      )
    } catch (e) {
      showSnackbar('Error rejecting proposal', 'error')
    }
  }

  const isInquiryCreator = user?.id === currentProposal.proposerId
  const isVendor = user?.id === currentProposal.vendorId
  const canAcceptOrReject = isInquiryCreator && currentProposal.isSelfAccepted === null

  const getProposalStatusText = () => {
    if (currentProposal.isSelfAccepted && currentProposal.isOtherAccepted) {
      return { text: 'Proposal Accepted by Both Parties', color: '#10b981', icon: 'check-circle' }
    }
    if (currentProposal.isSelfAccepted && !currentProposal.isOtherAccepted) {
      return { text: 'Waiting for Customer Response', color: '#f59e0b', icon: 'clock-outline' }
    }
    if (!currentProposal.isSelfAccepted && currentProposal.isOtherAccepted) {
      return { text: 'Waiting for Your Response', color: '#f59e0b', icon: 'clock-outline' }
    }
    if (currentProposal.isSelfAccepted === false || currentProposal.isOtherAccepted === false) {
      return { text: 'Proposal Rejected', color: '#ef4444', icon: 'close-circle' }
    }
    return { text: 'Pending Approvals', color: '#6b7280', icon: 'help-circle' }
  }

  const statusInfo = getProposalStatusText()

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onDismiss} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Proposal Chat</Text>
            <Text style={styles.headerSubtitle}>
              {isVendor ? currentProposal.proposer?.fullName : currentProposal.vendor?.fullName}
            </Text>
          </View>
        </View>

        <Divider />

        {/* Proposal Info Card */}
        <View style={styles.proposalInfoCard}>
          <View style={styles.proposalInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.proposalLabel}>Proposed Amount</Text>
              <Text style={styles.proposalPrice}>₹{currentProposal.price}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.proposalLabel}>Quantity</Text>
              <Text style={styles.proposalValue}>{currentProposal.quantity}</Text>
            </View>
          </View>

          {currentProposal.description && (
            <View style={styles.proposalDescriptionContainer}>
              <Text style={styles.proposalLabel}>Description</Text>
              <Text style={styles.proposalDescription} numberOfLines={2}>
                {currentProposal.description}
              </Text>
            </View>
          )}

          {/* Status Banner */}
          <View style={[styles.statusBanner, { backgroundColor: statusInfo.color + '15' }]}>
            <Icon name={statusInfo.icon as MaterialDesignIconsIconName} size={18} color={statusInfo.color} style={{ marginRight: 8 }} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          </View>
        </View>

        <Divider />

        {/* Messages List */}
        <View style={styles.messagesContainer}>
          {isPending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={currentProposal.comments || []}
              keyExtractor={(item: Comment) => item.id.toString()}
              refreshing={isPending}
              onRefresh={refetch}
              contentContainerStyle={styles.messagesList}
              renderItem={({ item }: { item: Comment }) => <MessageBubble message={item} />}
              ListEmptyComponent={
                <NoData
                  title="No Messages Yet"
                  description="Start a conversation about this proposal"
                  onRetry={refetch}
                  buttonLabel="Refresh"
                />
              }
            />
          )}
        </View>

        {/* Action Buttons (for inquiry creator) */}
        {canAcceptOrReject && (
          <View style={styles.actionButtonsContainer}>
            <Button
              mode="outlined"
              onPress={handleRejectProposal}
              style={[styles.actionButton, { borderColor: '#ef4444' }]}
              textColor="#ef4444"
              icon="close"
              disabled={updatingStatus}
            >
              Reject
            </Button>
            <Button
              mode="contained"
              onPress={handleAcceptProposal}
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              icon="check"
              loading={updatingStatus}
              disabled={updatingStatus}
            >
              Accept Proposal
            </Button>
          </View>
        )}

        {/* Chat Input */}
        <View style={styles.chatInputContainer}>
          <ChatInput
            name="content"
            onSend={handleSubmit(handleCreateComment)}
            isLoading={loadingComment}
            control={control}
            reset={reset}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Accept Confirmation Modal */}
      <Modal
        visible={acceptModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAcceptModalVisible(false)}
      >
        <View style={styles.confirmModalBackdrop}>
          <View style={styles.confirmModalContainer}>
            <Icon name="check-circle" size={48} color="#10b981" style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={styles.confirmModalTitle}>Accept Proposal?</Text>
            <Text style={styles.confirmModalText}>
              You are accepting this proposal for ₹{currentProposal.price}. This will notify the vendor and allow you to proceed with the order.
            </Text>

            <View style={styles.confirmModalActions}>
              <Button
                mode="outlined"
                onPress={() => setAcceptModalVisible(false)}
                style={{ flex: 1 }}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={confirmAcceptProposal}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#10b981' }}
                loading={updatingStatus}
                disabled={updatingStatus}
              >
                Confirm
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.confirmModalBackdrop}>
          <View style={styles.confirmModalContainer}>
            <Icon name="close-circle" size={48} color="#ef4444" style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={styles.confirmModalTitle}>Reject Proposal?</Text>
            <Text style={styles.confirmModalText}>
              Are you sure you want to reject this proposal? This action cannot be undone and the vendor will be notified.
            </Text>

            <View style={styles.confirmModalActions}>
              <Button
                mode="outlined"
                onPress={() => setRejectModalVisible(false)}
                style={{ flex: 1 }}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={confirmRejectProposal}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#ef4444' }}
                loading={updatingStatus}
                disabled={updatingStatus}
              >
                Reject
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#fff',
      gap: 12,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 13,
      color: '#666',
    },
    proposalInfoCard: {
      backgroundColor: '#fff',
      padding: 16,
      gap: 12,
    },
    proposalInfoRow: {
      flexDirection: 'row',
      gap: 16,
    },
    proposalLabel: {
      fontSize: 12,
      color: '#999',
      fontWeight: '500',
      marginBottom: 4,
    },
    proposalPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#10b981',
    },
    proposalValue: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    proposalDescriptionContainer: {
      marginTop: 8,
    },
    proposalDescription: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    statusBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    statusText: {
      fontSize: 13,
      fontWeight: '600',
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messagesList: {
      padding: 16,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    actionButton: {
      flex: 1,
    },
    chatInputContainer: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      paddingBottom: 8,
    },
    confirmModalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    confirmModalContainer: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    confirmModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    confirmModalText: {
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: 24,
    },
    confirmModalActions: {
      flexDirection: 'row',
      gap: 12,
    },
  })

export default ProposalChatModal

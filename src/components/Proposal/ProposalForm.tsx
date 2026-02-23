import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/components/form/TextField'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { useCreateProposal, useUpdateProposal } from '@/stores/hooks/useProposals'
import { useCreateBargain, useUpdateBargain } from '@/stores/hooks/useBargains'
import { proposalSchema } from '@/validation/proposalSchemas'
import { Button } from 'react-native-paper'
import { useAuthStore } from '@/stores/authStore'

interface ProposalFormProps {
  relatedObjId?: number
  proposal?: { price: ''; description: ''; quantity: ''; id?: number }
  onSuccess?: () => void
  onCancel: () => void
  buttonLabel: string
}

export type proposalSchemaType = z.infer<typeof proposalSchema>

export const ProposalForm: React.FC<ProposalFormProps> = ({
  relatedObjId,
  proposal,
  onSuccess,
  buttonLabel,
  onCancel,
}) => {
  const showSnackbar = useSnackbarStore.getState().showSnackbar
  const { user } = useAuthStore()

  const createProposalMutation = useCreateProposal()
  const updateProposalMutation = useUpdateProposal()
  const createBargainMutation = useCreateBargain()
  const updateBargainMutation = useUpdateBargain()

  const isBargain = buttonLabel === 'Bargain'

  const { control, handleSubmit } = useForm<proposalSchemaType>({
    resolver: zodResolver(proposalSchema),
    defaultValues: proposal || { price: '', description: '', quantity: '1' },
  })

  const onSubmit = async (data: any) => {
    try {
      if (isBargain) {
        if (proposal) {
          await updateBargainMutation.mutateAsync({ id: proposal.id, ...data })
          showSnackbar('Bargain updated successfully', 'success')
        } else {
          const bargain_data = { part_id: relatedObjId, proposer_id: user?.id, ...data }
          await createBargainMutation.mutateAsync(bargain_data)
          showSnackbar('Bargain created successfully', 'success')
        }
      } else {
        if (proposal) {
          await updateProposalMutation.mutateAsync({ id: proposal.id, ...data })
          showSnackbar('Proposal updated successfully', 'success')
        } else {
          const proposal_data = { inquiry_id: relatedObjId, proposer_id: user?.id, ...data }
          await createProposalMutation.mutateAsync(proposal_data)
          showSnackbar('Proposal created successfully', 'success')
        }
      }
      onSuccess?.()
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error submitting proposal', 'error')
    }
  }

  const isLoading = isBargain
    ? (createBargainMutation.isPending || updateBargainMutation.isPending)
    : (createProposalMutation.isPending || updateProposalMutation.isPending)

  return (
    <View>
      {/* Description Field */}
      <ScrollView>

      </ScrollView>
      <TextField
        control={control}
        name="description"
        label="Message"
        placeholder="Describe your proposal or message..."
        fontIconName="message-outline"
        multiline
        numberOfLines={4}
      />

      {/* Price Field */}
      <TextField
        control={control}
        name="price"
        label="Proposed Amount"
        placeholder="Enter amount"
        fontIconName="currency-inr"
        keyboardType="numeric"
      />

      {/* Quantity Field */}
      <TextField
        control={control}
        name="quantity"
        label="Quantity"
        placeholder="Enter quantity"
        fontIconName="package-variant"
        keyboardType="numeric"
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          {proposal ? `Update ${buttonLabel}` : 'Submit'}
        </Button>
        <Button
          mode="outlined"
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isLoading}
        >
          Close
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
})

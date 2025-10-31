import React from 'react'
import { View, Button } from 'react-native'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/components/form/TextField'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { useCreateProposal, useUpdateProposal } from '@/stores/hooks/useProposals'

interface ProposalFormProps {
  inquiryId: number;
  proposal: { amount: '', message: '', id: number };
  onSuccess: () => void;
}

const schema = z.object({
  amount: z.string().min(1, 'Amount required'),
  message: z.string().optional(),
})

export const ProposalForm: React.FC<ProposalFormProps> = ({ inquiryId, proposal, onSuccess }) => {
  const showSnackbar = useSnackbarStore.getState().showSnackbar
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: proposal || { amount: '', message: '' },
  })

  const createMutation = useCreateProposal()
  const updateMutation = useUpdateProposal()

  const onSubmit = async (data: any) => {
    try {
      if (proposal) {
        await updateMutation.mutateAsync({ id: proposal.id, ...data })
        showSnackbar('Proposal updated successfully', 'success')
      } else {
        await createMutation.mutateAsync({ inquiry_id: inquiryId, ...data })
        showSnackbar('Proposal created successfully', 'success')
      }
      onSuccess?.()
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error submitting proposal', 'error')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <TextField name="amount" label="Amount" control={control} keyboardType="numeric" />
      <TextField name="message" label="Message" control={control} multiline />
      <Button title={proposal ? 'Update Proposal' : 'Submit Proposal'} onPress={handleSubmit(onSubmit)} />
    </View>
  )
}

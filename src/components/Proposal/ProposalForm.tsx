import React from 'react'
import { View } from 'react-native'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/components/form/TextField'
import { useSnackbarStore } from '@/stores/hooks/useSnackbarStore'
import { useCreateProposal, useUpdateProposal } from '@/stores/hooks/useProposals'
import { proposalSchema } from '@/validation/proposalSchemas'
import { Button } from 'react-native-paper'
import Row from '../Row'
import { useAuthStore } from '@/stores/authStore'

interface ProposalFormProps {
  relatedObjId?: number;
  proposal?: { price: '', description: '', quantity: '', id?: number };
  onSuccess?: () => void;
  onCancel: () => void;
  buttonLabel: string;
}

export type proposalSchemaType = z.infer<typeof proposalSchema>

export const ProposalForm: React.FC<ProposalFormProps> = ({ relatedObjId, proposal, onSuccess, buttonLabel, onCancel }) => {
  const showSnackbar = useSnackbarStore.getState().showSnackbar
  const { user } = useAuthStore()
  const { control, handleSubmit, reset } = useForm<proposalSchemaType>({
    resolver: zodResolver(proposalSchema),
    defaultValues: proposal || { price: '', description: '', quantity: '1' },
  })


  const createMutation = useCreateProposal()
  const updateMutation = useUpdateProposal()

  const onSubmit = async (data: any) => {
    try {
      if (proposal) {
        await updateMutation.mutateAsync({ id: proposal.id, ...data })
        showSnackbar('Proposal updated successfully', 'success')
      } else {
        let const_data
        if (buttonLabel === 'Bargain')
          const_data = { part_id: relatedObjId, proposer_id: user?.id, ...data }
        else
          const_data = { inquiry_id: relatedObjId, proposer_id: user?.id, ...data }
        await createMutation.mutateAsync(const_data)
        showSnackbar('Proposal created successfully', 'success')
      }
      onSuccess?.()
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error submitting proposal', 'error')
    }
  }

  return (
    <View style={{ padding: 8 }}>
      <TextField name="description" label="Message" control={control} multiline rows={4} />
      <TextField name="price" label="Amount" control={control} keyboardType="numeric" />
      <TextField name="quantity" label="Quantity" control={control} keyboardType="numeric" />
      <Row>
        <Button mode={'contained'} style={{ marginTop: 16, flex: 1 }} onPress={handleSubmit(onSubmit)}>{proposal ? `Update ${buttonLabel}` : 'Submit'}</Button>
        <Button mode={'outlined'} style={{ marginTop: 16, marginLeft: 8 }} onPress={onCancel}>Close</Button>
      </Row>
    </View>
  )
}

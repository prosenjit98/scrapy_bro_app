
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
} from '@/api/inquiryService'
import { useSnackbarStore } from './useSnackbarStore'

export const useInquiries = () => {
  const queryClient = useQueryClient()
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar)

  const inquiriesQuery = useQuery({
    queryKey: ['my-inquiries'],
    queryFn: fetchMyInquiries,
  })

  const createMutation = (successCallback: () => void) => {

    return useMutation({
      mutationFn: createInquiry,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-inquiries'] })
        showSnackbar('Inquiry created successfully 🎉', 'success')
        successCallback()
      },
      onError: () => showSnackbar('Failed to create inquiry', 'error'),
    })
  }

  const updateMutation = (successCallback: () => void) => {
    return useMutation({
      mutationFn: updateInquiry,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-inquiries'] })
        showSnackbar('Inquiry updated successfully ✅', 'success')
        successCallback()
      },
      onError: () => showSnackbar('Failed to update inquiry', 'error'),
    })
  }

  const deleteMutation = useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-inquiries'] })
      showSnackbar('Inquiry deleted 🗑️', 'success')
    },
    onError: () => showSnackbar('Failed to delete inquiry', 'error'),
  })

  return { inquiriesQuery, createMutation, updateMutation, deleteMutation }
}

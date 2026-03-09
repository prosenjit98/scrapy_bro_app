import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClientAxios from '@/api/client'
import { useSnackbarStore } from './useSnackbarStore'
import { Alert } from 'react-native'

export const useVendorReviews = (vendorId?: number) => {
  return useQuery({
    queryKey: ['vendor_reviews', vendorId],
    queryFn: async () => {
      const res = await apiClientAxios.get(`/vendor_reviews?vendor_id=${vendorId}`)
      return res.data
    },
    enabled: !!vendorId,
  })
}

export const useCreateVendorReview = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbarStore()

  return useMutation({
    mutationFn: async (payload: { vendor_id: number; rating: number; comment?: string }) => {
      console.log('Submitting review:', payload)
      const res = await apiClientAxios.post('/vendor_reviews', payload)
      console.log('Review response:', res.data)
      return res.data
    },
    onSuccess: (_data, variables) => {
      showSnackbar('Review submitted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['vendor_reviews', variables.vendor_id] })
      queryClient.invalidateQueries({ queryKey: ['part_details'] })
      onSuccess?.()
    },
    onError: (e: any) => {
      console.error('Review submit error:', e?.response?.data || e?.message || e)
      const msg = e?.response?.data?.message || 'Failed to submit review'
      Alert.alert('Error', msg)
    },
  })
}

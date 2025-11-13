import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClientAxios from '@/api/client'
import { useSnackbarStore } from './useSnackbarStore'
import { createParts } from '@/api/vehicleService'

export const useGetParts = () => {
  return useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const res = await apiClientAxios.get('/parts')
      return res.data.data
    },
  })
}
export const useVendorParts = (vendorId: number) => {
  return useQuery({
    queryKey: ['vendor_parts'],
    queryFn: async () => {
      const res = await apiClientAxios.get('/parts?withAttachment=1&vendorId=' + vendorId)
      return res.data.data
    },
    enabled: !!vendorId,
  })
}

export const useGetPartDetails = (partId: number) => {
  return useQuery({
    queryKey: ['part_details', partId],
    queryFn: async () => {
      const res = await apiClientAxios.get(`/parts/${partId}`)
      return res.data.data as Part
    },
    enabled: !!partId,
  })
}

export const useCreatePart = (successCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: createParts,
    onSuccess: () => {
      showSnackbar('✅ Part created successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['vendor_parts'] });
      successCallback?.();
    },
    onError: (e) => { showSnackbar('❌ Failed to create part', 'error'); console.log(e); },
  });
};

export const useUpdatePart = (successCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: async ({ id, formData }: any) => {
      const res = await apiClientAxios.put(`/parts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data.data
    },
    onSuccess: () => {
      showSnackbar('✅ Part updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['vendor_parts'] });
      successCallback?.();
    },
    onError: (e) => {
      console.log(e)
      showSnackbar('❌ Failed to update part', 'error');
    },
  });
};
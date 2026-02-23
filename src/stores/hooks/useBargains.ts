import apiClientAxios from '@/api/client'
import { fetchMyBargain, createBargainComment } from '@/api/bargainService'
import { buildUrl } from '@/utility/commonFunction'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useUserBargains = (userId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['bargains_user', userId],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: `/bargains?userId=${userId}`, optionArr }))
      return res.data.data.data as Bargain[]
    },
    enabled: !!userId,
  })
}

export const useVendorBargains = (vendorId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['bargains_vendor', vendorId],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: `/bargains?vendorId=${vendorId}`, optionArr }))
      return res.data.data.data as Bargain[]
    },
    enabled: !!vendorId,
  })
}

export const usePartBargains = (partId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['bargains_part', partId],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: `/bargains?partId=${partId}`, optionArr }))
      return res.data.data.data as Bargain[]
    },
    enabled: !!partId,
  })
}

export const useMyBargains = (proposerId?: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['my_bargains', proposerId],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: '/bargains', optionArr }))
      return res.data.data.data as Bargain[]
    },
    enabled: !!proposerId,
  })
}

export const useGetBargain = (bargainId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['bargain_by_id', bargainId],
    queryFn: () => fetchMyBargain(bargainId, true),
    enabled: !!bargainId,
  })
}

export const useCreateBargain = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClientAxios.post(`/bargains`, payload)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bargains_vendor'] })
      queryClient.invalidateQueries({ queryKey: ['my_bargains'] })
    },
  })
}

export const useUpdateBargain = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const res = await apiClientAxios.put(`/bargains/${id}`, payload)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bargains_vendor'] })
      queryClient.invalidateQueries({ queryKey: ['my_bargains'] })
    },
  })
}

export const useCreateBargainComment = ({ bargainId }: any) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBargainComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bargain_by_id', bargainId] }),
  })
}

export const useUpdateBargainStatus = ({ bargainId }: any) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      price?: number
      is_accepted?: boolean
      is_self_accepted?: boolean
      is_other_accepted?: boolean
    }) => {
      const res = await apiClientAxios.put(`/bargains/${bargainId}`, payload)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bargain_by_id', bargainId] })
      queryClient.invalidateQueries({ queryKey: ['bargains_user'] })
      queryClient.invalidateQueries({ queryKey: ['bargains_vendor'] })
      queryClient.invalidateQueries({ queryKey: ['my_bargains'] })
    },
  })
}

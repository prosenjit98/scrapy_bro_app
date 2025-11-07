import apiClientAxios from '@/api/client'
import { createComment, fetchMyProposal } from '@/api/proposalService'
import { buildUrl } from '@/utility/commonFunction'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useUserProposals = (inquiryId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['proposals_user'],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: '/proposals', optionArr }))
      console.log(res.data.data.data)
      return res.data.data.data as Proposal[]
    },
    enabled: !!inquiryId
  })
}

export const useVendorProposals = (vendorId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['proposals_vendor'],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: '/proposals', optionArr }))
      return res.data.data
    },
    enabled: !!vendorId
  })

}

export const useGetProposal = (proposalId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['proposal_by_id', proposalId],
    queryFn: () => fetchMyProposal(proposalId),
    enabled: !!proposalId
  })

}

export const useCreateProposal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClientAxios.post(`/proposals`, payload)
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposals_vendor'] })
    },
  })
}

export const useUpdateProposal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const res = await apiClientAxios.put(`/proposals/${id}`, payload)
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposals_vendor'] }),
  })
}

export const useCreateComment = ({ proposalId }: any) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal_by_id', proposalId] }),
  })
}

export const useUpdateStatus = ({ proposalId }: any) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { price?: number, is_accepted: boolean }) => {
      const res = await apiClientAxios.put(`/proposals/${proposalId}`, payload)
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal_by_id', proposalId] }),
  })
}

import apiClientAxios from './client'

export const fetchProposals = async () => {
  const { data } = await apiClientAxios.get('/proposals?withComment=1')
  return data.data
}

export const fetchMyProposal = async (id: number) => {
  const { data } = await apiClientAxios.get(`/proposals/${id}`)
  return data.data as Proposal
}

export const createProposal = async (formData: FormData) => {
  const { data } = await apiClientAxios.post('/proposals', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const updateProposal = async ({ id, formData }: any) => {
  const { data } = await apiClientAxios.put(`/proposals/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const deleteProposal = async (id: string) => {
  const { data } = await apiClientAxios.delete(`/proposals/${id}`)
  return data.data
}

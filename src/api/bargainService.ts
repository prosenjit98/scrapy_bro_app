import apiClientAxios from './client'

export const fetchBargains = async (filters?: {
  page?: number
  limit?: number
  partId?: number
  vendorId?: number
  userId?: number
  withComments?: boolean
}) => {
  const params = new URLSearchParams()
  if (filters?.page) params.append('page', String(filters.page))
  if (filters?.limit) params.append('limit', String(filters.limit))
  if (filters?.partId) params.append('partId', String(filters.partId))
  if (filters?.vendorId) params.append('vendorId', String(filters.vendorId))
  if (filters?.userId) params.append('userId', String(filters.userId))
  if (filters?.withComments) params.append('withComments', '1')

  const { data } = await apiClientAxios.get(`/bargains?${params.toString()}`)
  return data.data
}

export const fetchMyBargain = async (id: number, withComments: boolean = true) => {
  const { data } = await apiClientAxios.get(`/bargains/${id}?withComments=${withComments ? 1 : 0}`)
  console.log('Fetched Bargain:', data.data)
  return data.data
}

export const createBargain = async (formData: FormData) => {
  const { data } = await apiClientAxios.post('/bargains', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const updateBargain = async ({ id, formData }: any) => {
  const { data } = await apiClientAxios.put(`/bargains/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const deleteBargain = async (id: string) => {
  const { data } = await apiClientAxios.delete(`/bargains/${id}`)
  return data.data
}

export const createBargainComment = async ({ id, formData }: any) => {
  const { data } = await apiClientAxios.post(`/bargains/${id}/comments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

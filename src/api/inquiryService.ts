// src/services/inquiryService.ts
import apiClientAxios from './client'

export const fetchMyInquiries = async () => {
  const { data } = await apiClientAxios.get('/inquiries')
  console.log(data.data)
  return data.data
}

export const createInquiry = async (formData: FormData) => {
  const { data } = await apiClientAxios.post('/inquiries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const updateInquiry = async ({ id, formData }: any) => {
  const { data } = await apiClientAxios.put(`/inquiries/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const deleteInquiry = async (id: string) => {
  const { data } = await apiClientAxios.delete(`/inquiries/${id}`)
  return data.data
}

import apiClientAxios from './client'


export const getProfile = async (params: { id: number }) => {
  console.log('Fetching profile for user:', params.id)
  const res = await apiClientAxios.get(`/users/${params.id}`)
  return res.data.data
}

export const updateProfile = async (params: { profile: any, id: number }) => {
  const { data } = await apiClientAxios.put(`/users/${params.id}`, params.profile)
  return data.data
}

export const uploadProfileImage = async (params: { formData: FormData, id: number }) => {
  const { data } = await apiClientAxios.put(`/users/${params.id}`, params.formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

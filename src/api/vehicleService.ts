import useLoaderState from '@/stores/loaderState';
import apiClientAxios from './client'

export const fetchVehicles = async () => {
  useLoaderState.getState().show();
  const res = await apiClientAxios.get(`/vehicles`)
  return res.data.data
}

export const fetchModels = async () => {
  useLoaderState.getState().show();
  const res = await apiClientAxios.get(`/models`)
  return res.data.data
}

export const fetchMakes = async () => {
  useLoaderState.getState().show();
  const res = await apiClientAxios.get(`/makes`)
  return res.data.data
}

export const createParts = async (props: { payload: any }) => {
  console.log(props)
  const { data } = await apiClientAxios.post(`/parts`, props.payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

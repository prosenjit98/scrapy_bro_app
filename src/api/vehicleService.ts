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

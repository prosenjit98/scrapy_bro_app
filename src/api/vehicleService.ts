import useLoaderState from '@/stores/loaderState';
import apiClientAxios from './client'

export const fetchVehicles = async () => {
  useLoaderState.getState().show();
  const res = await apiClientAxios.get(`/vehicles`)
  return res.data.data
}

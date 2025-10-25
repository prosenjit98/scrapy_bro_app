import { useQuery } from '@tanstack/react-query'
import { fetchMakes, fetchModels, fetchVehicles } from '@/api/vehicleService'

export const useVehicles = () => {

  const getAllVehicles = useQuery({
    queryKey: ['vehicle-list'],
    queryFn: fetchVehicles,
    staleTime: 24 * 60 * 60 * 1000, // 5 minutes
  })

  const getAllVehicleModels = useQuery({
    queryKey: ['vehicle-model'],
    queryFn: fetchModels,
    staleTime: 24 * 60 * 1000, // 24 hours
  })

  const getAllVehicleMake = useQuery({
    queryKey: ['vehicle-make'],
    queryFn: fetchMakes,
    staleTime: 24 * 60 * 1000, // 24 hours
  })

  const modifiedFetchMakes = () => {
    const { data } = getAllVehicleMake
    return useQuery({
      queryKey: ['vehicle-make-modified'],
      queryFn: () => {
        return data?.map((model: { name: string, id: number }) => ({
          label: model.name,
          value: model.id,
        })) ?? []
      },
      enabled: data?.length > 0,
      staleTime: 24 * 60 * 1000, // 24 hours
    })
  }

  const modifiedFetchModels = () => {
    const { data } = getAllVehicleModels
    return useQuery({
      queryKey: ['vehicle-model-modified'],
      queryFn: () => {
        return data?.map((model: { name: string, id: number }) => ({
          label: model.name,
          value: model.id,
        })) ?? []
      },
      enabled: data?.length > 0,
      staleTime: 24 * 60 * 1000, // 24 hours
    })
  }



  return { getAllVehicles, getAllVehicleModels, getAllVehicleMake, modifiedFetchMakes, modifiedFetchModels }
}

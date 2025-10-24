import { useQuery } from '@tanstack/react-query'
import { fetchVehicles } from '@/api/vehicleService'

export const useVehicles = () => {

  const getAllVehicles = useQuery({
    queryKey: ['vehicle-list'],
    queryFn: fetchVehicles,
    staleTime: 24 * 60 * 1000, // 5 minutes
  })

  return { getAllVehicles }
}

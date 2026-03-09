import apiClientAxios from '@/api/client'
import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  totalParts: number
  activeOrders: number
  pendingProposals: number
  totalRevenue: number
}

interface RecentOrder {
  id: number
  totalPrice: number
  status: string
  createdAt: string
  user?: { id: number; fullName: string }
}

interface RecentPart {
  id: number
  name: string
  price: number
  isAvailable: boolean
  stock: number | null
}

export interface VendorDashboardData {
  user: any
  stats: DashboardStats
  recentOrders: RecentOrder[]
  recentParts: RecentPart[]
}

export const useVendorDashboard = () => {
  return useQuery<VendorDashboardData>({
    queryKey: ['vendor_dashboard'],
    queryFn: async () => {
      const res = await apiClientAxios.get('/dashboard')
      return res.data.data
    },
  })
}

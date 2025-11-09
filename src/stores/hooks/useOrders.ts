import apiClientAxios from '@/api/client';
import { buildUrl } from '@/utility/commonFunction';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationResult,
} from '@tanstack/react-query';

export const useGetUserOrders = (userId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['orders_user'],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: `/orders?userId=${userId}`, optionArr }))
      return res.data.data.data as Order[]
    },
    enabled: !!userId
  })
}

export const useGetVendorOrders = (userId: number, optionArr?: OptionsStr[]) => {
  return useQuery({
    queryKey: ['orders_vendor'],
    queryFn: async () => {
      const res = await apiClientAxios.get(buildUrl({ baseUrl: `/orders?vendorId=${userId}`, optionArr }))
      return res.data.data as Order[]
    },
    enabled: !!userId
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiClientAxios.post('/orders', orderData);
      return res.data.data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders_user'] });
      queryClient.invalidateQueries({ queryKey: ['orders_vendor'] });
    },
  });
}
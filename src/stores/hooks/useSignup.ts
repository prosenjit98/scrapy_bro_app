import { useMutation } from '@tanstack/react-query'
import { signupApi } from '@/api/auth'
import { useAuthStore } from '../authStore';


export const useSignup = () => {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: signupApi,
    onSuccess: (data: UserResponse) => {
      if (data?.token) {
        login({ token: data.token.token, user: data.user })
      }
    },
    onError: (error: any) => console.log(error?.message)
  })
}

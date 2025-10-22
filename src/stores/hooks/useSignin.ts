import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/api/auth'
import { useAuthStore } from '../authStore';
import { useSnackbarStore } from './useSnackbarStore';


export const useSignin = () => {
  const login = useAuthStore((s) => s.login);
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar)

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data: UserResponse) => {
      if (data?.token) {
        login({ token: data.token.token, user: data.user })
        showSnackbar('Login successful 🎉', 'success')
      }
    },
    onError: (error: any) => {
      console.log(error?.message)
      const msg = error?.message ? error.message : "Something when wrong"
      showSnackbar(msg, 'error')
    }
  })
}
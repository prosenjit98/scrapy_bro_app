import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSnackbarStore } from './useSnackbarStore'
import { useAuthStore } from '../authStore'
import { getProfile, updateProfile, uploadProfileImage } from '@/api/profileService'


export const useProfile = () => {
  const queryClient = useQueryClient()
  const { setUser, user } = useAuthStore()
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar)

  const profileQuery = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: user?.id ? () => getProfile({ id: user.id! }) : skipToken,
      // select: (data) => {
      //   console.log(data)
      //   setUser(data)
      //   return data
      // }
    })
  }

  const updateMutation = () => {
    return useMutation({
      mutationFn: updateProfile,
      onSuccess: async (data) => {
        setUser(data)
        showSnackbar('Profile updated successfully 🎉', 'success')
        await queryClient.invalidateQueries({ queryKey: ['profile'] })
      },
      onError: () => showSnackbar('Failed to update profile', 'error'),
    })
  }

  const uploadMutation = (successCallback: () => void) => {

    return useMutation({
      mutationFn: uploadProfileImage,
      onSuccess: async (data) => {
        setUser(data)
        showSnackbar('Profile picture updated ✅', 'success')
        await queryClient.invalidateQueries({ queryKey: ['profile'] })
        successCallback()
      },
      onError: () => showSnackbar('Image upload failed', 'error'),
    })
  }

  return { profileQuery, updateMutation, uploadMutation }
}

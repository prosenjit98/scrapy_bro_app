import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@/components/form/TextField'
import { ProfileSchema } from '@/validation/authSchemas'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/stores/hooks/useProfile'


type ProfileForm = z.infer<typeof ProfileSchema>

const ProfileEditScreen = () => {
  const theme = useTheme()
  const { user } = useAuthStore()
  const { updateMutation } = useProfile()
  const { mutate, isPending } = updateMutation();


  const { control, handleSubmit } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    },
  })


  const onSubmit = (data: ProfileForm) => {
    if (user)
      mutate({ profile: data, id: user?.id! })
  }

  return (
    <View>
      <Text variant="headlineSmall" style={{ marginBottom: 24 }}>
        Edit Profile
      </Text>

      <TextField control={control} name="fullName" label="Full Name" />
      <TextField control={control} name="email" label="Email" />
      <TextField control={control} name="phoneNumber" label="Phone" />
      <TextField control={control} name="address" label="Address" />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: 24, borderRadius: 8 }}
        loading={isPending}
        disabled={isPending}
      >
        Save Changes
      </Button>

      {isPending && (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  )
}

export default ProfileEditScreen

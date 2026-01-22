import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
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
  const styles = makeStyles(theme.colors)

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
    <View style={styles.card}>
      {/* Full Name / Store Name Field */}
      <TextField control={control} name="fullName" label='Full Name' placeholder='Enter name' fontIconName="account" />

      {/* Email Field */}
      <TextField control={control} name="email" label="Email" placeholder="Enter your email" fontIconName="email" />
      <TextField control={control} name="phoneNumber" label="Phone" fontIconName="phone" placeholder="Enter your phone number" />
      <TextField control={control} name="address" label="Address" fontIconName="map-marker" numberOfLines={3} placeholder="Enter your address" />

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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginTop: -30,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }
  })

export default ProfileEditScreen

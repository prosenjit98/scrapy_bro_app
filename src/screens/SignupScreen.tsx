import React from 'react'
import { View, ScrollView } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { TextField, CheckboxField } from '@/components/form'
import { signupSchema } from '@/validation/authSchemas'
import { useSignup } from '@/stores/hooks/useSignup'

// ✅ Define Zod schema

type SignupFormType = z.infer<typeof signupSchema>

const SignupScreen = () => {
  const { control, handleSubmit, formState } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: undefined,
      address: '',
      confirmPassword: '',
      role: 'user',
      agree: false,
    },
  })

  const { mutate, isPending } = useSignup()

  const onSubmit = (data: SignupFormType) => {
    const { confirmPassword, ...payload } = data
    const dataNew = {...payload, role: 'user' as 'user' | 'vendor' }
    console.log('✅ Form submitted:', dataNew)
    mutate(dataNew)
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Create Account
      </Text>

      <TextField control={control} name="fullName" label="Full Name" />

      <TextField control={control} name="email" label="Email" />

      <TextField control={control} name="password" label="Password" secureTextEntry />

      <TextField control={control} name="confirmPassword" label="ReType Password" secureTextEntry />

      <TextField control={control} name="phoneNumber" label="Phone Number" keyboardType="numeric"/>

      <TextField control={control} name="address" label="address" multiline/>

      {/* <SelectField
        control={control}
        name="role"
        label="Select Role"
        multiple
        searchable
        options={[
          { label: 'Buyer', value: 'buyer' },
          { label: 'Seller', value: 'seller' },
        ]}
      />
      {formState.errors.role && (
        <Text style={{ color: 'red', marginBottom: 8 }}>{formState.errors.role.message}</Text>
      )} */}

      <CheckboxField control={control} name="agree" label="I agree to the terms and conditions" />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isPending} style={{ marginTop: 16 }}>
        Sign Up
      </Button>
    </ScrollView>
  )
}

export default SignupScreen

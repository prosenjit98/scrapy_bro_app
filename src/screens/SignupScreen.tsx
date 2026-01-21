import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { CheckboxField, TextField } from '@/components/form'
import { signupSchema } from '@/validation/authSchemas'
import { useSignup } from '@/stores/hooks/useSignup'
import { useThemeStore } from '@/stores/themeStore'
import { AppTheme } from '@/theme'
import Icon from '@react-native-vector-icons/material-design-icons'

type SignupFormType = z.infer<typeof signupSchema>

const SignupScreen = ({ navigation }: any) => {
  const theme = useThemeStore().theme
  const { colors } = theme
  //@ts-ignore
  const styles = makeStyles(colors)

  const [role, setRole] = useState<'user' | 'vendor'>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { control, handleSubmit, watch } = useForm<SignupFormType>({
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
    const dataNew = { ...payload, role: role }
    console.log('✅ Form submitted:', dataNew)
    mutate(dataNew)
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Logo & Title Section */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <Icon name="shopping" size={32} color="#fff" />
        </View>
        <Text variant="headlineMedium" style={styles.title}>Scrapy</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Join our marketplace today</Text>
      </View>

      {/* Register Card */}
      <View style={styles.card}>
        <Text variant="headlineSmall" style={styles.cardTitle}>Create Account</Text>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text variant="labelLarge" style={styles.roleLabel}>I want to</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'user' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('user')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'user' && styles.roleButtonTextActive,
                ]}
              >
                Buy Items
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'vendor' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('vendor')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'vendor' && styles.roleButtonTextActive,
                ]}
              >
                Sell Items
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Full Name / Store Name Field */}
        <TextField
          control={control}
          name="fullName"
          label={role === 'vendor' ? 'Store Name' : 'Full Name'}
          placeholder={role === 'vendor' ? 'Enter your store name' : 'Enter your full name'}
          fontIconName="account"
        />

        {/* Email Field */}
        <TextField
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          fontIconName="email"
        />

        {/* Password Field */}
        <TextField
          control={control}
          name="password"
          label="Password"
          placeholder="Create a password"
          secureTextEntry={!showPassword}
          fontIconName="lock"
          rightIcon={() => (
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          )}
        />

        {/* Confirm Password Field */}
        <TextField
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry={!showConfirmPassword}
          fontIconName="lock"
          rightIcon={() => (
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          )}
        />
        {/* Phone Number Field */}
        <TextField
          control={control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter your phone number"
          fontIconName="phone"
        />

        {/* Address Field */}
        <TextField
          control={control}
          name="address"
          label="Address"
          placeholder="Enter your address"
          fontIconName="map-marker"
          multiline
          numberOfLines={3}
        />

        {/* Vendor Notice */}
        {role === 'vendor' && (
          <View style={styles.vendorNotice}>
            <Icon name="alert" size={18} color="#b45309" style={{ marginRight: 8 }} />
            <Text style={styles.vendorNoticeText}>
              Vendor accounts require admin verification before you can start listing products.
            </Text>
          </View>
        )}



        {/* Terms & Conditions Checkbox */}
        <View style={{ marginBottom: 20 }}>
          <Controller
            control={control}
            name="agree"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.checkboxWrapper}
                onPress={() => onChange(!value)}
              >
                <View style={[styles.checkbox, value && styles.checkboxActive]}>
                  {value && <Icon name="check" size={16} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the terms and conditions
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          style={styles.signupButton}
          labelStyle={styles.signupButtonLabel}
        >
          Create Account
        </Button>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logoContainer: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: '#4f46e5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      elevation: 8,
      shadowColor: '#4f46e5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
      fontWeight: '700',
      color: colors.onBackground,
    },
    subtitle: {
      textAlign: 'center',
      color: '#666',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 24,
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    cardTitle: {
      marginBottom: 20,
      fontWeight: '600',
      color: colors.onBackground,
    },
    roleSection: {
      marginBottom: 16,
    },
    roleLabel: {
      marginBottom: 12,
      color: '#333',
      fontWeight: '500',
    },
    roleButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    roleButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#f3f4f6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    roleButtonActive: {
      backgroundColor: '#4f46e5',
      elevation: 4,
      shadowColor: '#4f46e5',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    roleButtonText: {
      fontWeight: '600',
      color: '#333',
    },
    roleButtonTextActive: {
      color: '#fff',
    },
    fieldSection: {
      marginBottom: 12,
    },
    fieldLabel: {
      marginBottom: 8,
      color: '#333',
      fontWeight: '500',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
    },
    multilineWrapper: {
      alignItems: 'flex-start',
      paddingVertical: 8,
    },
    inputIcon: {
      marginRight: 8,
      marginTop: 4,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: '#111',
    },
    multilineInput: {
      paddingTop: 8,
      textAlignVertical: 'top',
    },
    passwordToggle: {
      padding: 8,
    },
    vendorNotice: {
      flexDirection: 'row',
      backgroundColor: '#fef3c7',
      borderWidth: 1,
      borderColor: '#fcd34d',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    vendorNoticeText: {
      flex: 1,
      fontSize: 13,
      color: '#92400e',
      fontWeight: '500',
    },
    checkboxWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#d1d5db',
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxActive: {
      backgroundColor: '#4f46e5',
      borderColor: '#4f46e5',
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      color: '#333',
    },
    signupButton: {
      paddingVertical: 8,
      marginBottom: 16,
      backgroundColor: '#4f46e5',
    },
    signupButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
    },
    loginSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      color: '#666',
    },
    loginLink: {
      color: '#4f46e5',
      fontWeight: '600',
    },
  })

export default SignupScreen

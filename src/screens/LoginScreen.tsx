import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/components/form/TextField';
import { LoginSchema } from '@/validation/authSchemas';
import { useSignin } from '@/stores/hooks/useSignin';
import { useThemeStore } from '@/stores/themeStore';
import { AppTheme } from '@/theme';
import Icon from '@react-native-vector-icons/material-design-icons';


type LoginForm = z.infer<typeof LoginSchema>;

const LoginScreen = ({ navigation }: any) => {
  const { theme, toggleTheme } = useThemeStore();
  const { colors } = theme;
  //@ts-ignore
  const styles = makeStyles(colors);

  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useSignin();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginForm) => {
    // mutate({ ...data, role });
    mutate({ ...data });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Logo & Title Section */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <Icon name="shopping" size={32} color="#fff" />
        </View>
        <Text variant="headlineMedium" style={styles.title}>Scrapy</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Your trusted auto parts marketplace</Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Text variant="headlineSmall" style={styles.cardTitle}>Welcome Back</Text>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text variant="labelLarge" style={styles.roleLabel}>I am a</Text>
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
                Buyer
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
                Vendor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
          label="Password 2"
          placeholder="Enter your password"
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

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          style={styles.loginButton}
          labelStyle={styles.loginButtonLabel}
        >
          Login
        </Button>

        {/* Register Link */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
      marginBottom: 24,
      fontWeight: '600',
      color: colors.onBackground,
    },
    roleSection: {
      marginBottom: 20,
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
    passwordToggle: {
      padding: 8,
    },
    forgotPasswordButton: {
      alignSelf: 'flex-end',
      marginBottom: 20,
    },
    forgotPasswordText: {
      color: '#4f46e5',
      fontWeight: '600',
      fontSize: 14,
    },
    loginButton: {
      paddingVertical: 8,
      marginBottom: 20,
      backgroundColor: '#4f46e5',
    },
    loginButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
    },
    registerSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    registerText: {
      color: '#666',
    },
    registerLink: {
      color: '#4f46e5',
      fontWeight: '600',
    },
  });

export default LoginScreen;

import React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/components/form/TextField';
import { LoginSchema } from '@/validation/authSchemas';
import { useSignin } from '@/stores/hooks/useSignin';
import { useThemeStore } from '@/stores/themeStore';
import { AppTheme } from '@/theme';


type LoginForm = z.infer<typeof LoginSchema>;

const LoginScreen = ({ navigation }: any) => {
  const theme = useThemeStore().theme;
  const { colors } = theme;
  // @ts-ignore
  const styles = makeStyles(colors);

  const { mutate, isPending } = useSignin();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/splash_logo.png')}
        style={{ width: 100, height: 100, resizeMode: 'contain', alignSelf: 'center' }}
      />
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 20 }}> Welcome To Scrapy </Text>
      <TextField control={control} name="email" label="Email" keyboardType="email-address" />
      <TextField control={control} name="password" label="Password" secureTextEntry />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isPending} style={{ marginTop: 16 }}>
        Login
      </Button>
      <Button
        mode="text"
        onPress={() => {
          navigation.navigate('Signup')
        }}
        style={{ marginTop: 8 }}
      >
        Don’t have an account? Sign up
      </Button>
    </ScrollView>
  );
};

const makeStyles = (_colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: _colors.background,
    }
  })

export default LoginScreen

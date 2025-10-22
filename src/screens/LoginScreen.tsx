import React from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

type LoginForm = { email: string; password: string };

export default function LoginScreen({ navigation }: any) {
  const login = useAuthStore((s) => s.login);
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginForm) => loginApi(data.email, data.password),
    onSuccess: (data: UserResponse) => login({user: data.user, token: data.token?.token}),
    onError: (error: any) => console.log(error?.message)
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text variant="headlineMedium">Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Email" value={value} onChangeText={onChange} style={{ marginVertical: 8 }} mode="outlined"/>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            style={{ marginVertical: 8 }}
            mode="outlined"
          />
        )}
      />

      <Button mode="contained" loading={isPending} onPress={onSubmit}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Signup')}>Go to Signup</Button>
    </View>
  );
}

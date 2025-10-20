import React from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { signupApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

type SignupForm = { email: string; password: string };

export default function SignupScreen({ navigation }: any) {
  const login = useAuthStore((s) => s.login);
  const { control, handleSubmit } = useForm<SignupForm>({
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignupForm) => signupApi(data.email, data.password),
    onSuccess: (data) => login(data.token),
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text variant="headlineMedium">Signup</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Email" value={value} onChangeText={onChange} style={{ marginVertical: 8 }} />
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
          />
        )}
      />

      <Button mode="contained" loading={isPending} onPress={onSubmit}>
        Signup
      </Button>
      <Button onPress={() => navigation.navigate('Login')}>Go to Login</Button>
    </View>
  );
}

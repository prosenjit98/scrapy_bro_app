import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '@/api/client';
import { useProfile } from '@/stores/hooks/useProfile'

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (data: { user: User, token: string }) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
  isFirstLaunch: boolean;
  checkFirstLaunch: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isFirstLaunch: false,
      user: null,
      isLoading: true,
      login: ({ user, token }) => {
        set({ token: token, user: user });
        setAuthToken(token);
      },
      logout: async () => {
        set({ user: null, token: null })
      },
      hydrate: async () => {
        const saved = await AsyncStorage.getItem('auth-storage');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed?.state?.token) setAuthToken(parsed.state.token);
        set({ isLoading: false });
      },
      setUser: async (user) => {
        set({ user: user })
      },
      checkFirstLaunch: async () => {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched')
        if (!hasLaunched) {
          await AsyncStorage.setItem('hasLaunched', 'true')
          set({ isFirstLaunch: true })
        } else {
          set({ isFirstLaunch: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

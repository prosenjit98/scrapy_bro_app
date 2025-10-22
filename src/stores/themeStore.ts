import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, theme as lightTheme } from '@/theme';

type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  theme: typeof lightTheme | typeof darkTheme;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      theme: lightTheme,
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({
          mode: newMode,
          theme: newMode === 'light' ? lightTheme : darkTheme,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

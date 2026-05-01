import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,

      toggleTheme: () => {
        set((state) => {
          const next = !state.isDark;
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark: next };
        });
      },

      setDark: (dark: boolean) => {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDark: dark });
      },
    }),
    {
      name: 'quickbase-lite-theme',
    }
  )
);
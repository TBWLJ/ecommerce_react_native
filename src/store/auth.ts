import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login, register } from "@/services/auth";
import { AuthUser } from "@/types/models";

type SignInInput = { email: string; password: string };
type SignUpInput = SignInInput & { name: string };

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  setHydrated: (hydrated: boolean) => void;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "avatar">>) => void;
};

const storage = createJSONStorage(() => AsyncStorage);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hydrated: false,
      token: null,
      user: null,
      setHydrated: (hydrated) => set({ hydrated }),
      signIn: async ({ email, password }) => {
        const result = await login(email, password);
        set({ token: result.token, user: result.user });
        return result.user;
      },
      signUp: async ({ name, email, password }) => {
        const result = await register(name, email, password);
        set({ token: result.token, user: result.user });
        return result.user;
      },
      signOut: () => set({ user: null, token: null }),
      updateProfile: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state
        ),
    }),
    {
      name: "shop4me.auth",
      storage,
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

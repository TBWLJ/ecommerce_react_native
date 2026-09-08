import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { AuthRole, AuthUser, StoredUser } from "@/types/models";

type SignInInput = {
  email: string;
  password: string;
};

type SignUpInput = SignInInput & {
  name: string;
  role?: AuthRole;
};

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  users: StoredUser[];
  setHydrated: (hydrated: boolean) => void;
  signIn: (input: SignInInput) => AuthUser;
  signUp: (input: SignUpInput) => AuthUser;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "avatar">>) => void;
};

const storage = createJSONStorage(() => AsyncStorage);
const USERS_KEY = "shop4me.users";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const makeId = () =>
  `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

const makeToken = () =>
  `tok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;

const publicUser = (user: StoredUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

const seedUsers: StoredUser[] = [];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      token: null,
      user: null,
      users: seedUsers,
      setHydrated: (hydrated) => set({ hydrated }),
      signIn: ({ email, password }) => {
        const normalizedEmail = normalizeEmail(email);
        const existing = get().users.find(
          (user) =>
            normalizeEmail(user.email) === normalizedEmail &&
            user.password === password
        );

        if (!existing) {
          throw new Error("Invalid email or password");
        }

        const user = publicUser(existing);
        const token = makeToken();

        set({ user, token });
        return user;
      },
      signUp: ({ name, email, password, role = "customer" }) => {
        const normalizedEmail = normalizeEmail(email);
        const existing = get().users.find(
          (user) => normalizeEmail(user.email) === normalizedEmail
        );

        if (existing) {
          throw new Error("An account already exists for this email");
        }

        const created: StoredUser = {
          id: makeId(),
          name: name.trim(),
          email: normalizedEmail,
          password,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(
            normalizedEmail
          )}`,
          role,
        };

        const users = [...get().users, created];
        const user = publicUser(created);
        const token = makeToken();

        set({ users, user, token });
        return user;
      },
      signOut: () => set({ user: null, token: null }),
      updateProfile: (patch) => {
        const current = get().user;
        if (!current) {
          return;
        }

        const updatedUser: AuthUser = {
          ...current,
          ...patch,
        };

        set((state) => ({
          user: updatedUser,
          users: state.users.map((stored) =>
            stored.id === updatedUser.id
              ? {
                  ...stored,
                  name: updatedUser.name,
                  avatar: updatedUser.avatar,
                }
              : stored
          ),
        }));
      },
    }),
    {
      name: "shop4me.auth",
      storage,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

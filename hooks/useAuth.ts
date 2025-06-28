import { create } from "zustand"

interface AuthState {
  isAuth: boolean
  login: () => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuth: true, // Default state: not logged in
  login: () => set({ isAuth: true }),
  logout: () => set({ isAuth: false }),
}))
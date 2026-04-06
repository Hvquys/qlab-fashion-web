import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    login: (userData, token) => {
        localStorage.setItem('accessToken', token);
        set({ user: userData, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
    }
}));
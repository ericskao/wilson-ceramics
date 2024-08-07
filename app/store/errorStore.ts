// store/useErrorStore.js
import { create } from 'zustand';

interface ErrorState {
  errorMessage: string | null;
  setError: (message: string) => void;
  clearError: () => void;
}

const useErrorStore = create((set) => ({
  errorMessage: null,
  setError: (message) => set({ errorMessage: message }),
  clearError: () => set({ errorMessage: null }),
}));

export default useErrorStore;

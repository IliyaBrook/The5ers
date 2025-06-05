import { authStore } from '@/stores/AuthStore';

export type { SignUpData, SignInData, AuthError, User } from '@/stores/AuthStore';

export const useAuth = () => {
  return {
    signUp: authStore.signUp.bind(authStore),
    signIn: authStore.signIn.bind(authStore),
    isLoading: authStore.isLoading,
    error: authStore.error,
    setError: authStore.setError.bind(authStore),
  };
};

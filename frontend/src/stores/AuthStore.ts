import { makeAutoObservable, runInAction } from 'mobx';

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface AuthError {
  message: string;
}

class AuthStore {
  user: User | null = null;
  accessToken: string | null = null;
  isLoading = false;
  error: AuthError | null = null;
  isAuthenticated = false;
  isInitializing = true;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('accessToken');
      if (storedUser && storedToken) {
        try {
          this.user = JSON.parse(storedUser);
          this.accessToken = storedToken;
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      }
      this.isInitializing = false;
    }
  }

  private saveUserToStorage(user: User, accessToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
    }
  }

  private removeUserFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }

  setError(error: AuthError | null) {
    this.error = error;
  }

  async signIn(data: SignInData): Promise<User | null> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch('/api/users/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign in');
      }

      const result = await response.json();

      runInAction(() => {
        this.user = result.user;
        this.accessToken = result.accessToken;
        this.isAuthenticated = true;
        this.isLoading = false;
      });

      this.saveUserToStorage(result.user, result.accessToken);
      return result.user;
    } catch (err) {
      runInAction(() => {
        this.error = {
          message: err instanceof Error ? err.message : 'Sign in failed',
        };
        this.isLoading = false;
      });
      throw err;
    }
  }

  async signUp(data: SignUpData): Promise<User | null> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch('/api/users/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const result = await response.json();

      runInAction(() => {
        this.user = result.user;
        this.accessToken = result.accessToken;
        this.isAuthenticated = true;
        this.isLoading = false;
      });

      this.saveUserToStorage(result.user, result.accessToken);
      return result.user;
    } catch (err) {
      runInAction(() => {
        this.error = {
          message: err instanceof Error ? err.message : 'Sign up failed',
        };
        this.isLoading = false;
      });
      throw err;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/users/refresh', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const result = await response.json();

      runInAction(() => {
        this.user = result.user;
        this.accessToken = result.accessToken;
        this.isAuthenticated = true;
      });

      this.saveUserToStorage(result.user, result.accessToken);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.signOut();
      return false;
    }
  }

  signOut() {
    runInAction(() => {
      this.user = null;
      this.accessToken = null;
      this.isAuthenticated = false;
      this.error = null;
    });
    this.removeUserFromStorage();
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  get fullName(): string {
    if (!this.user) return '';
    return `${this.user.firstname} ${this.user.lastname}`;
  }
}

export const authStore = new AuthStore();

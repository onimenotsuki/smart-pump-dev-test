import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, ApiResponse, User, UserUpdateInput } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.client.post(
      '/auth/login',
      credentials
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Login failed');
    }
    
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get('/users/me');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get profile');
    }
    
    return response.data.data;
  }

  async getBalance(): Promise<{ balance: string }> {
    const response: AxiosResponse<ApiResponse<{ balance: string }>> = await this.client.get(
      '/users/me/balance'
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get balance');
    }
    
    return response.data.data;
  }

  async updateProfile(updateData: UserUpdateInput): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.put(
      '/users/me',
      updateData
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update profile');
    }
    
    return response.data.data;
  }
}

export const apiClient = new ApiClient();

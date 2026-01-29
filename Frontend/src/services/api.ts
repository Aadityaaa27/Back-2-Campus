import axios, { AxiosInstance, AxiosError } from 'axios';

// API Base URL - Update this based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://student-alumini-webapp.onrender.com/api/v1';

// Create axios instance with longer timeout for Render cold starts
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds (for slow backend/cold starts)
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  role: 'student' | 'alumni' | 'mentor';
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

export interface ProfileData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  college_name?: string;
  current_year?: string;
  subject_to_discuss?: string;
  company?: string;
  position?: string;
  yearsOfExperience?: number;
  expertise?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  email: string;
  role: string;
}

// Auth API
export const authAPI = {
  // Student Login
  loginStudent: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login-student', {
      email,
      password,
    });
    return response.data;
  },

  // Alumni/Mentor Login
  loginMentor: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login-mentor', {
      email,
      password,
    });
    return response.data;
  },

  // Student Signup with extended timeout
  signupStudent: async (userData: {
    fullName: string;
    email: string;
    password: string;
    college_name: string;
    current_year: string;
    subject_to_discuss: string;
  }): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/auth/signup-student', userData, {
      timeout: 90000, // 90 seconds for signup
    });
    return response.data;
  },

  // Alumni/Mentor Signup with retry logic
  signupMentor: async (userData: {
    fullName: string;
    email: string;
    password: string;
    passedYear: number;
    expertise: string[];
  }): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/auth/signup-mentor', userData, {
      timeout: 90000, // 90 seconds for signup (even longer for cold start)
    });
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<ProfileData> => {
    const response = await apiClient.get<ProfileData>('/auth/profile');
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/auth/logout');
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    return response.data;
  },

  // Send OTP
  sendOTP: async (email: string, name: string, role: string): Promise<OTPResponse> => {
    const response = await apiClient.post<OTPResponse>('/auth/send-otp', {
      email,
      name,
      role,
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/auth/verify-otp', {
      email,
      otp,
    });
    return response.data;
  },
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return 'An unexpected error occurred';
};

export default apiClient;

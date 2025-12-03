import { api } from './api';

export interface LoginResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  organizations: { id: number; name: string }[];
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return response.data;
}

export interface User {
  _id: string;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: string;
  name: {
    first: string;
    last: string;
  };
  company: string;
  email: string;
  password: string; // hashed password
  phone: string;
  address: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name: {
    first: string;
    last: string;
  };
  phone: string;
  address: string;
  company: string;
  age: number;
  eyeColor: string;
}

export interface UserUpdateInput {
  name?: {
    first: string;
    last: string;
  };
  phone?: string;
  address?: string;
  email?: string;
  company?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

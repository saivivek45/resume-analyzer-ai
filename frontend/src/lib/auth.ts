export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

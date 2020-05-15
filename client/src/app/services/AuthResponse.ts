export interface AuthResponse {
  username: string;
  roles: string[];
  jwtToken: string;
  refreshToken: string;
}

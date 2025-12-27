export type Role = 'USER' | 'DOCTOR' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
}

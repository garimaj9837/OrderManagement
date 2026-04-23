export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface UserInfo {
  username: string;
  role: UserRole;
}


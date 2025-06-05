export interface IUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRefreshToken {
  token: string;
  user: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface IUserQueryProjection {
  email?: 1 | 0;
  firstname?: 1 | 0;
  lastname?: 1 | 0;
  password?: 1 | 0;
  createdAt?: 1 | 0;
  updatedAt?: 1 | 0;
  [key: string]: 1 | 0 | undefined;
}

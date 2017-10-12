import { UserType } from '@/models/User/UserType';

/** Basic user definition */
export interface User {
  [k: string]: any;
  username: string;
  userType: UserType;
}

/** User definition as it is stored in the database */
export interface DatabaseUser extends User {
  hash: string;
  userId: number;
}

/** User definition for creating a new user */
export interface CreationUser extends User {
  password: string;
}

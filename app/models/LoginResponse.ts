import { User } from "./User";
import { ApiResponse } from "./ApiResponse";

export interface LoginData {
  accessToken?: string;
  refreshToken?: string;
  user: User;
  profileCompleted: boolean;
  profileVerified: boolean;
}

export type LoginResponse = ApiResponse<LoginData>;

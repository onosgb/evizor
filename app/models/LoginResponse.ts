import { User } from "./User";
import { ApiResponse } from "./ApiResponse";

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type LoginResponse = ApiResponse<LoginData>;

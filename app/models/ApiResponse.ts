/**
 * Generic API Response model
 * All API responses follow this structure with varying data types
 *
 * The data field can be:
 * - A single object: ApiResponse<User>
 * - An array: ApiResponse<User[]>
 * - Any other type: ApiResponse<string>, ApiResponse<number>, etc.
 *
 * @example
 * // Single object response
 * type UserResponse = ApiResponse<User>;
 *
 * @example
 * // Array response
 * type UsersResponse = ApiResponse<User[]>;
 *
 * @example
 * // Paginated array response
 * type PaginatedUsersResponse = ApiResponse<{ users: User[], total: number }>;
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  status: boolean;
  error?: string;
  message: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data: T;
}

/**
 * Helper type for array responses
 * Use this when the API returns an array of items
 */
export type ApiArrayResponse<T> = ApiResponse<T[]>;

import type { ApiResponse } from "./ApiResponse";

/**
 * Custom error class for API errors
 * Uses ApiResponse structure for error responses
 */
export class ApiError extends Error {
  statusCode: number;
  status: boolean;
  error?: string;
  data?: any;

  constructor(
    message: string,
    statusCode: number,
    status: boolean = false,
    error?: string,
    data?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = status;
    this.error = error;
    this.data = data;
  }

  /**
   * Create ApiError from ApiResponse
   */
  static fromResponse<T = any>(response: ApiResponse<T>): ApiError {
    return new ApiError(
      response.message,
      response.statusCode,
      response.status,
      response.error,
      response.data
    );
  }
}

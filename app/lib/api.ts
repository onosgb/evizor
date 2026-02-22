/**
 * @deprecated This file is deprecated. Use services from app/lib/services instead.
 *
 * Migration guide:
 * - authApi -> import { authService } from "../lib/services"
 * - staffApi -> import { staffService } from "../lib/services"
 *
 * This file is kept for backward compatibility but will be removed in a future version.
 */

// Re-export services for backward compatibility
export { authService as authApi } from "./services";
export { userService as staffApi } from "./services";

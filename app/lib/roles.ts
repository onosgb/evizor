/**
 * Central role definitions and helper functions.
 *
 * Valid roles in the system: DOCTOR | ADMIN | SUPERADMIN
 * There is no STAFF role — every user must be a Doctor, Admin, or Super Admin.
 *
 * Usage:
 *   import { isAdmin, isDoctor, isSuperAdmin, getTheme, isValidPortalUser } from "@/app/lib/roles";
 */

export const UserRole = {
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

type MaybeUser = { role?: string | null } | null | undefined;
type KnownUser = { role: string };

/** True for both ADMIN and SUPERADMIN. */
export function isAdmin(user: MaybeUser): boolean {
  return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
}

/** True only for SUPERADMIN. */
export function isSuperAdmin(user: MaybeUser): boolean {
  return user?.role === UserRole.SUPERADMIN;
}

/** True only for DOCTOR. */
export function isDoctor(user: MaybeUser): boolean {
  return user?.role === UserRole.DOCTOR;
}

/**
 * Returns the UI theme string for a user.
 * Admins (ADMIN + SUPERADMIN) → "admin"
 * Everyone else              → "doctor"
 */
export function getTheme(user: MaybeUser): "admin" | "doctor" {
  return isAdmin(user) ? "admin" : "doctor";
}

/**
 * Returns true when the user holds a role that is allowed to log in
 * to this portal (DOCTOR, ADMIN, SUPERADMIN).
 */
export function isValidPortalUser(user: KnownUser): boolean {
  return (
    user.role === UserRole.DOCTOR ||
    user.role === UserRole.ADMIN ||
    user.role === UserRole.SUPERADMIN
  );
}

/**
 * Returns true when the user must complete their profile before
 * accessing the app (i.e. they are NOT an admin).
 */
export function requiresProfileCompletion(user: MaybeUser): boolean {
  return !isAdmin(user);
}

import { create } from "zustand";
import { Staff, CreateStaffRequest, ApiResponse, ApiError } from "../models";
import { userService } from "../lib/services";
import { ListQueryParams } from "../models/QueryParams";

interface UserState {
  users: Staff[];
  total: number;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  formError: string | null;

  // Actions
  fetchUsers: (params: ListQueryParams) => Promise<void>;
  createUser: (data: CreateStaffRequest) => Promise<boolean>;
  toggleUserStatus: (userId: string, status: string) => Promise<boolean>;
  resetFormError: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  total: 0,
  isLoading: false,
  error: null,
  isSubmitting: false,
  formError: null,

  fetchUsers: async (params: ListQueryParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getAllUsers(params);
      if (response.status && response.data) {
        set({
          users: response.data,
          total: response.total ?? 0,
          isLoading: false
        });
      } else {
        set({
          error: response.message || "Failed to fetch users",
          isLoading: false
        });
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching users:", err);
    }
  },

  createUser: async (data: CreateStaffRequest) => {
    set({ isSubmitting: true, formError: null });
    try {
      const response = await userService.createUser(data);
      if (response.status && response.data) {
        set((state) => ({
          users: [...state.users, response.data],
          isSubmitting: false
        }));
        return true;
      } else {
        set({
          formError: response.message || "Failed to create user",
          isSubmitting: false
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "An unexpected error occurred";
      set({ formError: errorMessage, isSubmitting: false });
      console.error("Error creating user:", err);
      return false;
    }
  },

  toggleUserStatus: async (userId: string, status: string) => {
    set({ error: null });
    try {
      const response = await userService.toggleUserStatus(userId, status);
      if (response.status && response.data) {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? response.data : u)),
        }));
        return true;
      } else {
        set({ error: response.message || "Failed to update user status" });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "An unexpected error occurred";
      set({ error: errorMessage });
      console.error("Error toggling user status:", err);
      return false;
    }
  },

  resetFormError: () => set({ formError: null }),
}));

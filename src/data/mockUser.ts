// src/data/mockUser.ts

import { type User } from "../types/user";

/**
 * Mock current logged-in user
 * 
 * Phase 1: Hardcoded mock user
 * Phase 3: This will come from AuthContext after login
 *          const { user } = useAuth();
 */
export const mockCurrentUser: User = {
  id: "user1",
  name: "Kate Bridgerton",
  email: "BridgertonK.05@gmail.com",
  createdAt: "January 2026",
};

/**
 * Mock saved recipe IDs
 * Simulates which recipes the user has bookmarked
 * 
 * Phase 3: This will come from backend
 *          GET /api/users/:id/saved-recipes
 */
export const mockSavedRecipeIds: string[] = [
  "1", // Pizza
  "3", // Pancakes
];

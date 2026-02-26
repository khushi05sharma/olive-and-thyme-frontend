import { type User } from "../types/user";

export const mockCurrentUser: User = {
  id: "user1",
  name: "Kate Bridgerton",
  email: "kateB.03@gmail.com",
  createdAt: "February 2026",
};

/**
 * Mock saved recipe IDs
 * Simulates which recipes the user has bookmarked
 *
 * Phase 3: This will come from backend
 *          GET /api/users/:id/saved-recipes
 */

export const mockSavedRecipeIds: string[] = ["1", "3"];

/**
 * User interface
 * Represents a user in the application
 *
 * Phase 1: Mock user data
 * Phase 3: Stored in MongoDB, returned from backend after login
 */

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt?: string;
}

/**
 * User Statistics interface
 * Calculated stats for dashboard display
 *
 * Phase 1: Calculated from mock data
 * Phase 3: Returned from backend: GET /api/users/:id/stats
 */

export interface UserStats {
  recipeCount: number;
  totalLikes: number;
  savedCount: number;
}

/**
 * Dashboard Tab type
 * Used for tab navigation state
 */

export type DashboardType = "my-recipes" | "saved" | "activity";

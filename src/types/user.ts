// src/types/user.ts

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
  profileImage?: string;  // Optional: URL to profile picture
  createdAt?: string;     // Optional: When user joined
}

/**
 * User Statistics interface
 * Calculated stats for dashboard display
 * 
 * Phase 1: Calculated from mock data
 * Phase 3: Returned from backend: GET /api/users/:id/stats
 */
export interface UserStats {
  recipesCount: number;   // Total recipes uploaded by user
  totalLikes: number;     // Sum of all likes on user's recipes
  savedCount: number;     // Number of recipes user has bookmarked
}

/**
 * Dashboard Tab type
 * Used for tab navigation state
 */
export type DashboardTab = 'my-recipes' | 'saved' | 'activity';

/**
 * User interface
 * Represents a user in the application
 */
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;  // Optional 
  createdAt?: string;     // Optional
}

/**
 * User Statistics interface
 * Calculated stats for dashboard display
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

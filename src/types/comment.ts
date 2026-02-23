/**
 * Comment interface
 * Used for recipe comments
 * Later will be stored in MongoDB
 */

export interface Comment {
  id: string;
  recipeId: string; // Which recipe this comment belongs to
  userId: string; // Who posted the comment
  userName: string; // Display name
  userAvatar?: string; // Optional profile picture URL
  text: string; // Comment content
  likes: number; // How many likes this comment has
  createdAt: string; // When comment was posted
  updatedAt?: string; // When comment was last edited (optional)
}

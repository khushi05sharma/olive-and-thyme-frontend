/**
 * Notification Type
 * Different types of notifications users can receive
 */
export type NotificationType = "like" | "comment" | "follow" | "system";

/**
 * Notification interface
 * Represents a single notification
 *
 * Phase 1: Mock data
 * Phase 3: Stored in MongoDB, fetched from: GET /api/notifications
 */

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string; // Recipient of the notification
  actorId: string; // Who triggered the notification
  actorName: string; // Display name of actor
  actorAvatar?: string; // Optional avatar
  recipeId?: string; // Related recipe (for like/comment)
  recipeTitle?: string; // Recipe name (for display)
  recipeImage?: string; // Recipe thumbnail
  message: string; // Notification message
  read: boolean; // Has user read this?
  createdAt: string; // When notification was created
}

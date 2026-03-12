import { type Notification } from "../types/notification";

import pizzaImg from "../assets/pizza.jpg";
import chickenBurgerImg from "../assets/Chicken Burger.jpg";
import cakeImg from "../assets/cake.jpg";
import pancakeImg from "../assets/pancake.jpg";

/**
 * Mock notifications for the current user
 *
 * Phase 1: Hardcoded mock data
 * Phase 3: Fetched from backend: GET /api/users/:id/notifications
 */

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    userId: "user1",
    actorId: "user2",
    actorName: "Sarah Martinez",
    recipeId: "1",
    recipeTitle: "Classic Margherita Pizza",
    recipeImage: pizzaImg,
    message: "liked your recipe",
    read: false,
    createdAt: "2 hours ago",
  },
  {
    id: "n2",
    type: "comment",
    userId: "user1",
    actorId: "user3",
    actorName: "John Wilson",
    recipeId: "1",
    recipeTitle: "Classic Margherita Pizza",
    recipeImage: pizzaImg,
    message: 'commented on your recipe: "This looks amazing!"',
    read: false,
    createdAt: "5 hours ago",
  },
  {
    id: "n3",
    type: "like",
    userId: "user1",
    actorId: "user4",
    actorName: "Priya Sharma",
    recipeId: "2",
    recipeTitle: "Chicken Burger",
    recipeImage: chickenBurgerImg,
    message: "liked your recipe",
    read: true,
    createdAt: "1 day ago",
  },
  {
    id: "n4",
    type: "comment",
    userId: "user1",
    actorId: "user5",
    actorName: "Mike Johnson",
    recipeId: "5",
    recipeTitle: "Chocolate Lava Cake",
    recipeImage: cakeImg,
    message: 'commented on your recipe: "Perfect dessert!"',
    read: true,
    createdAt: "2 days ago",
  },
  {
    id: "n5",
    type: "like",
    userId: "user1",
    actorId: "user6",
    actorName: "Emily Chen",
    recipeId: "3",
    recipeTitle: "Fluffy Blueberry Pancakes",
    recipeImage: pancakeImg,
    message: "liked your recipe",
    read: true,
    createdAt: "3 days ago",
  },
  {
    id: "n6",
    type: "system",
    userId: "user1",
    actorId: "system",
    actorName: "Olive & Thyme",
    message:
      "Welcome to Olive & Thyme! Start sharing your recipes with the community.",
    read: true,
    createdAt: "1 week ago",
  },
];

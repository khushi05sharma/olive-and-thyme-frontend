import { type Comment } from "../types/comment";

/**
 * Mock comments for recipes
 * In Phase 3, these will come from MongoDB
 */

export const mockComments: Comment[] = [
  // PIZZA (id: 1)
  {
    id: "c1",
    recipeId: "1",
    userId: "user2",
    userName: "Kavya Sharma",
    text: "Tried this pizza yesterday and it turned out amazing! The crust was crispy and flavorful.",
    likes: 12,
    createdAt: "2 days ago",
  },
  {
    id: "c2",
    recipeId: "1",
    userId: "user3",
    userName: "Namita Papnai",
    text: "Loved how simple and authentic this recipe is. Perfect for a homemade pizza night.",
    likes: 6,
    createdAt: "5 days ago",
  },

  // THAI GREEN CURRY (id: 2)

  {
    id: "c3",
    recipeId: "2",
    userId: "user1",
    userName: "Khushi Sharma",
    text: "The flavors are so rich and comforting. Coconut milk + curry paste is a winning combo!",
    likes: 9,
    createdAt: "1 day ago",
  },
  {
    id: "c4",
    recipeId: "2",
    userId: "user4",
    userName: "Annu Sharma",
    text: "Loved the aroma while cooking this. Tasted just like restaurant-style Thai curry.",
    likes: 7,
    createdAt: "4 days ago",
  },

  // PANCAKES (id: 3)
  {
    id: "c5",
    recipeId: "3",
    userId: "user5",
    userName: "Nannu Papnai",
    text: "Super fluffy pancakes! My weekend breakfast is sorted now 😄",
    likes: 10,
    createdAt: "3 days ago",
  },

  // MUSHROOM PASTA (id: 4)
  {
    id: "c6",
    recipeId: "4",
    userId: "user6",
    userName: "Ishita Papnai",
    text: "Creamy, comforting, and very easy to make. Perfect for busy evenings.",
    likes: 11,
    createdAt: "1 week ago",
  },

  // CHOCOLATE LAVA CAKE (id: 5)
  {
    id: "c7",
    recipeId: "5",
    userId: "user7",
    userName: "Manya Rajwar",
    text: "That molten center is everything 😍 Served it with ice cream and it was heavenly.",
    likes: 18,
    createdAt: "2 days ago",
  },

  // QUINOA SALAD (id: 6)
  {
    id: "c8",
    recipeId: "6",
    userId: "user3",
    userName: "Namita Papnai",
    text: "Light, fresh, and filling. Loved it as a healthy lunch option.",
    likes: 5,
    createdAt: "3 days ago",
  },

  // CHICKEN BURGER (id: 7)
  {
    id: "c9",
    recipeId: "7",
    userId: "user2",
    userName: "Kavya Sharma",
    text: "Juicy and spicy! This burger tastes better than many cafés honestly.",
    likes: 14,
    createdAt: "2 days ago",
  },

  // MANGO SMOOTHIE (id: 8)
  {
    id: "c10",
    recipeId: "8",
    userId: "user4",
    userName: "Annu Sharma",
    text: "So refreshing and perfect for summers. Loved the mango-y taste!",
    likes: 8,
    createdAt: "1 day ago",
  },

  // VEG SANDWICH (id: 9)
  {
    id: "c11",
    recipeId: "9",
    userId: "user1",
    userName: "Khushi Sharma",
    text: "Simple, quick, and delicious. Great snack with evening chai ☕",
    likes: 6,
    createdAt: "4 days ago",
  },

  // SALMON (id: 10)
  {
    id: "c12",
    recipeId: "10",
    userId: "user5",
    userName: "Nannu Papnai",
    text: "Very elegant and flavorful dish. The herb crust adds so much taste.",
    likes: 16,
    createdAt: "2 days ago",
  },
];

/**
 * Get comments for a specific recipe
 * Later this will be an API call: GET /api/recipes/:id/comments
 */
export const getCommentsByRecipeId = (recipeId: string): Comment[] => {
  return mockComments.filter((comment) => comment.recipeId === recipeId);
};

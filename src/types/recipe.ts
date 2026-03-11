export type MealType = 
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Dessert"
  | "Snacks"
  | "Drinks";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string; // Path to image
  cookingTime: number; // In minutes
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string; // "Italian", "Indian", etc.
  mealType: MealType ; // "Breakfast", "Lunch", "Dinner", "Dessert"
  diet: string[]; // ["Vegetarian", "Vegan", etc.]
  healthGoals?: string[];   
  ingredients: string[];
  instructions: string[];
  likes: number;
  isLiked?: boolean; // Optional (user-specific)
  isSaved?: boolean; // Optional (user-specific)
  author?: {
    // Optional (for user-uploaded recipes)
    id: string;
    name: string;
  };
  createdAt?: string; // Optional
}

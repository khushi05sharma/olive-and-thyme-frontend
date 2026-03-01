import { type FC, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Plus, Trash2, ChefHat } from "lucide-react";

import { mockRecipes } from "../data/mockRecipes";
import { mockCurrentUser } from "../data/mockUser";
import { type Recipe, type MealType } from "../types/recipe";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

//INTERFACES

interface FormData {
  title: string;
  description: string;
  image: string | null;
  cookingTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard" | "";
  mealType: MealType | "";
  cuisine: string;
  diet: string[];
  ingredients: string[];
  instructions: string[];
}

interface FormErrors {
  [key: string]: string;
}

// CONSTANTS

const CUISINES = [
  "Italian",
  "Indian",
  "American",
  "Chinese",
  "Japanese",
  "Thai",
  "Mexican",
  "French",
  "Mediterranean",
  "Korean",
];

const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Dessert",
];

const DIETS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
];

const AddRecipe: FC = () => {
  const navigate = useNavigate();

  // STATE

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: null,
    cookingTime: 30,
    servings: 4,
    difficulty: "",
    cuisine: "",
    mealType: "",
    diet: [],
    ingredients: [""],
    instructions: [""],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLERS: Basic Fields

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // HANDLERS: Diet Checkboxes

  const handleDietChange = (diet: string): void => {
    setFormData({
      ...formData,
      diet: formData.diet[0] === diet ? [] : [diet],
    });
  };

  // HANDLERS: Image Upload

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select an image file" });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size must be less than 5MB" });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData({ ...formData, image: result });
      setErrors({ ...errors, image: "" });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (): void => {
    setImagePreview(null);
    setFormData({ ...formData, image: null });
  };

   // HANDLERS: Dynamic Ingredients

    const addIngredient = (): void => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ""],
    });
  };

  
};

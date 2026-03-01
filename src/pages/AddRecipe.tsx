import { type FC, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Plus, Trash2, ChefHat } from "lucide-react";
import placeholderImg from "../assets/placeholder.png";

import { mockRecipes } from "../data/mockRecipes";
import { mockCurrentUser } from "../data/mockUser";
import { type Recipe, type MealType } from "../types/recipe";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

interface FormData {
  title: string;
  description: string;
  image: string | null;
  cookingTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard" | "";
  cuisine: string;
  mealType: MealType | "";
  diet: string[];
  ingredients: string[];
  instructions: string[];
}

interface FormErrors {
  [key: string]: string;
}

// ============================================
// CONSTANTS
// ============================================

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

// ============================================
// ADD RECIPE PAGE
// ============================================

const AddRecipe: FC = () => {
  const navigate = useNavigate();

  // ══════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════

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

  // ══════════════════════════════════════════
  // HANDLERS: Basic Fields
  // ══════════════════════════════════════════

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

  // ══════════════════════════════════════════
  // HANDLERS: Diet Checkboxes
  // ══════════════════════════════════════════

  const handleDietChange = (diet: string): void => {
    const newDiet = formData.diet.includes(diet)
      ? formData.diet.filter((d) => d !== diet)
      : [...formData.diet, diet];

    setFormData({ ...formData, diet: newDiet });
  };

  // ══════════════════════════════════════════
  // HANDLERS: Image Upload
  // ══════════════════════════════════════════

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

  // ══════════════════════════════════════════
  // HANDLERS: Dynamic Ingredients
  // ══════════════════════════════════════════

  const addIngredient = (): void => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ""],
    });
  };

  const removeIngredient = (index: number): void => {
    if (formData.ingredients.length === 1) return; // Keep at least one
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (index: number, value: string): void => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  // ══════════════════════════════════════════
  // HANDLERS: Dynamic Instructions
  // ══════════════════════════════════════════

  const addInstruction = (): void => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""],
    });
  };

  const removeInstruction = (index: number): void => {
    if (formData.instructions.length === 1) return; // Keep at least one
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    });
  };

  const updateInstruction = (index: number, value: string): void => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  // ══════════════════════════════════════════
  // VALIDATION
  // ══════════════════════════════════════════

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Title
    if (!formData.title.trim()) {
      newErrors.title = "Recipe title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    // Description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Cooking time
    if (formData.cookingTime <= 0) {
      newErrors.cookingTime = "Cooking time must be greater than 0";
    }

    // Servings
    if (formData.servings <= 0) {
      newErrors.servings = "Servings must be greater than 0";
    }

    // Difficulty
    if (!formData.difficulty) {
      newErrors.difficulty = "Please select difficulty level";
    }

    // Cuisine
    if (!formData.cuisine) {
      newErrors.cuisine = "Please select a cuisine";
    }

    // Meal Type
    if (!formData.mealType) {
      newErrors.mealType = "Please select a meal type";
    }

    // Ingredients
    const validIngredients = formData.ingredients.filter((i) => i.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    // Instructions
    const validInstructions = formData.instructions.filter((i) => i.trim());
    if (validInstructions.length === 0) {
      newErrors.instructions = "At least one instruction step is required";
    }

    return newErrors;
  };

  // ══════════════════════════════════════════
  // SUBMIT
  // ══════════════════════════════════════════

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // Validate
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create recipe object
    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image || placeholderImg, // Fallback
      cookingTime: formData.cookingTime,
      servings: formData.servings,
      difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
      cuisine: formData.cuisine,
      mealType: formData.mealType as MealType,
      diet: formData.diet,
      ingredients: formData.ingredients.filter((i) => i.trim()),
      instructions: formData.instructions.filter((i) => i.trim()),
      likes: 0,
      author: {
        id: mockCurrentUser.id,
        name: mockCurrentUser.name,
      },
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };

    // Phase 1: Add to mockRecipes (simulating backend)
    mockRecipes.push(newRecipe);

    // Phase 3: POST to backend
    // const response = await fetch('/api/recipes', {
    //   method: 'POST',
    //   body: JSON.stringify(newRecipe)
    // });
    // const savedRecipe = await response.json();

    setIsSubmitting(false);

    // Success message
    alert("Recipe published successfully!");

    // Navigate to dashboard
    navigate("/dashboard");
  };

  // ══════════════════════════════════════════
  // RENDER
  return (
    <div className="min-h-screen py-8 bg-primary-light">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <ChefHat size={50} className="text-white bg-primary rounded-xl" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Share Your Recipe
          </h1>
          <p className="text-gray-600">
            Fill in the details below to share your culinary creation with the
            community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE UPLOAD SECTION */}

          <div className="p-6 bg-white rounded-lg shadow-sm soft-glow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recipe Image
            </h2>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="object-cover w-full h-64 rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute p-2 text-white transition bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="relative flex flex-col items-center justify-center h-64 overflow-hidden transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary">
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-pink-200/40 via-yellow-200/40 to-pink-300/40 hover:opacity-100" />
                <Upload size={48} className="mb-2 text-gray-400" />
                <span className="mb-1 text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG (max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-2 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* BASIC INFORMATION */}

          <div className="p-6 bg-white rounded-lg shadow-sm soft-glow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Basic Information
            </h2>

            <div className="space-y-4">
              <Input
                label="Recipe Title"
                name="Title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g: Creamy Mushroom Pasta"
                required
                error={errors.title}
              />

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="A brief description of your recipe..."
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.description
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RECIPE DETAILS */}

          <div className="p-6 bg-white rounded-lg shadow-sm soft-glow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recipe Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Cooking Time (minutes)"
                name="cookingTime"
                type="number"
                value={formData.cookingTime}
                onChange={handleInputChange}
                required
                error={errors.cookingTime}
                min="1"
              />

              <Input
                label="Servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleInputChange}
                required
                error={errors.servings}
                min="1"
              />

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.difficulty
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  required
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.difficulty}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Cuisine <span className="text-red-500">*</span>
                </label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.cuisine
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  required
                >
                  <option value="">Select cuisine</option>
                  {CUISINES.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
                {errors.cuisine && (
                  <p className="mt-1 text-sm text-red-500">{errors.cuisine}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Meal Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.mealType
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  required
                >
                  <option value="">Select meal type</option>
                  {MEAL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.mealType && (
                  <p className="mt-1 text-sm text-red-500">{errors.mealType}</p>
                )}
              </div>
            </div>

            {/* Diet Checkboxes */}
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Diet Preferences (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DIETS.map((diet) => (
                  <label
                    key={diet}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.diet.includes(diet)}
                      onChange={() => handleDietChange(diet)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{diet}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* INGREDIENTS */}
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;

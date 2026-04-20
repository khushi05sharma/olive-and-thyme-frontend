import { type FC, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Trash2, ChefHat, LinkIcon } from "lucide-react";
// import placeholderImg from "../assets/placeholder.png";

import { useAuth } from "../context/AuthContext";
import { createRecipeApi } from "../services/authApi";
import { type MealType } from "../types/recipe";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

interface FormData {
  title: string;
  description: string;
  // image: string | null;
  imageUrl: string;
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

  const { user, token, isLoggedIn } = useAuth();

  // ══════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    // image: null,
    imageUrl: "",
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
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ══════════════════════════════════════════
  // HANDLERS: Basic Fields
  // ══════════════════════════════════════════

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
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

  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Validate file type
  //   if (!file.type.startsWith("image/")) {
  //     setErrors({ ...errors, image: "Please select an image file" });
  //     return;
  //   }

  //   // Validate file size (5MB max)
  //   if (file.size > 5 * 1024 * 1024) {
  //     setErrors({ ...errors, image: "Image size must be less than 5MB" });
  //     return;
  //   }

  //   // Create preview
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const result = reader.result as string;
  //     setImagePreview(result);
  //     setFormData({ ...formData, image: result });
  //     setErrors({ ...errors, image: "" });
  //   };
  //   reader.readAsDataURL(file);
  // };

  // const removeImage = (): void => {
  //   setImagePreview(null);
  //   setFormData({ ...formData, image: null });
  // };

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
    if (!formData.ingredients.some((i) => i.trim()))
      newErrors.ingredients = "At least one ingredient is required";

    // Instructions
    if (!formData.instructions.some((i) => i.trim()))
      newErrors.instructions = "At least one instruction step is required";

    return newErrors;
  };

  // ----------- SUBMIT -------------

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // user must logged-in
    if (!isLoggedIn || !token) {
      navigate("/");
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitting(true);
    setServerError("");

    try {
      await createRecipeApi(
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: formData.imageUrl.trim(),
          cookingTime: formData.cookingTime,
          servings: formData.servings,
          difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
          cuisine: formData.cuisine,
          mealType: formData.mealType as MealType,
          diet: formData.diet,
          ingredients: formData.ingredients.filter((i) => i.trim()),
          instructions: formData.instructions.filter((i) => i.trim()),
          // Author NOT sent — backend reads it from JWT token
        },
        token,
      );

      console.log(`[RECIPE] Published by ${user?.name}`);
      navigate("/dashboard");
    } catch (error: any) {
      setServerError(error.message || "Failed to publish recipe. Try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Server error banner */}
        {serverError && (
          <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE UPLOAD SECTION */}

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recipe Image
            </h2>

            {/* File upload — disabled for now */}
            <div className="flex flex-col items-center justify-center h-40 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-400">
                File upload coming soon
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Use the URL option below
              </p>
            </div>

            {/* NEW — image URL input */}

            <div className="mt-4">
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <LinkIcon size={16} />
                Image URL (optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/my-recipe-image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste a direct image URL. Leave empty to use a default
                placeholder.
              </p>

              {/* Preview if URL entered */}
              {formData.imageUrl && (
                <div className="relative mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-lg"
                    onError={(e) => {
                      // If URL is broken — hide preview
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BASIC INFORMATION */}

          <div className="p-6 bg-white rounded-lg shadow-sm soft-glow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Basic Information
            </h2>

            <div className="space-y-4">
              <Input
                label="Recipe Title"
                name="title"
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

          <div className="p-6 bg-white rounded-lg shadow-sm soft-glow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Ingredients <span className="text-red-500">*</span>
              </h2>
              <Button
                type="button"
                onClick={addIngredient}
                variant="ghost"
                size="small"
                className="gap-1"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex items-center justify-center flex-shrink-0 w-8 h-10 text-sm font-medium text-gray-600">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., 2 cups all-purpose flour"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-600 transition rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.ingredients && (
              <p className="mt-2 text-sm text-red-500">{errors.ingredients}</p>
            )}
          </div>

          {/* INSTRUCTIONS */}

          <div className="p-6 bg-white rounded-lg shadow-sm soft-glow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Instructions <span className="text-red-500">*</span>
              </h2>
              <Button
                type="button"
                onClick={addInstruction}
                variant="ghost"
                size="small"
                className="gap-1"
              >
                <Plus size={16} />
                Add Step
              </Button>
            </div>

            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center flex-shrink-0 w-16 h-10 text-sm font-medium text-gray-600">
                    Step {index + 1}
                  </div>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`e.g., ${
                      index === 0
                        ? "Preheat oven to 350°F"
                        : "Mix ingredients together"
                    }`}
                    rows={2}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-2 text-red-600 transition rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.instructions && (
              <p className="mt-2 text-sm text-red-500">{errors.instructions}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <ChefHat size={20} />
                  Publish Recipe
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;

import { type FC, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// TYPESCRIPT INTERFACES

export interface FilterState {
  mealType: string[];
  cuisine: string[];
  diet: string[];
  healthGoals: string[];
}

interface FilterSidebarProps {
  selectedFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  recipeCount: number;
}

// FILTER OPTIONS (STATIC DATA)

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"];

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

const DIETS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
];

const HEALTH_GOALS = [
  "Heart Healthy",
  "Diabetic Friendly",
  "High Protein",
  "Low Sodium",
  "Low Carb",
  "Anti-Inflammatory",
  "Gut Friendly",
  "Weight Management",
  "Kidney Friendly",
  "Immune Boosting",
];

// COLOR STYLES PER CATEGORY
// Meal Type: Orange theme
const MEAL_TYPE_COLORS = {
  inactive:
    "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  active: "bg-primary text-white border-primary",
};

// Cuisine: Green theme
const CUISINE_COLORS = {
  inactive: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  active: "bg-green-600 text-white border-green-600",
};

// Diet: Blue theme
const DIET_COLORS = {
  inactive: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  active: "bg-blue-600 text-white border-blue-600",
};

// Health Goals: Purple theme
const HEALTH_COLORS = {
  inactive:
    "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  active: "bg-purple-600 text-white border-purple-600",
};

// FILTER SIDEBAR COMPONENT

const FilterSidebar: FC<FilterSidebarProps> = ({
  selectedFilters,
  onFilterChange,
  recipeCount,
}) => {
  // track which filter sections are expanded (mobile)
  const [expandedSections, setExpandedSections] = useState({
    mealType: true,
    cuisine: true,
    diet: true,
    healthGoals: true,
  });

  // TOGGLE FILTER SELECTION

  const toggleFilter = (category: keyof FilterState, value: string): void => {
    const current = selectedFilters[category];

    // If already selected, remove it
    if (current.includes(value)) {
      onFilterChange({
        ...selectedFilters,
        [category]: current.filter((item) => item !== value),
      });
    } else {
      // if not selected, add it
      onFilterChange({
        ...selectedFilters,
        [category]: [...current, value],
      });
    }
  };

  // CLEAR ALL FILTERS

  const clearAllFilters = (): void => {
    onFilterChange({
      mealType: [],
      cuisine: [],
      diet: [],
      healthGoals: [],
    });
  };

  // TOGGLE SECTION EXPANSION (MOBILE)

  const toggleSection = (section: keyof typeof expandedSections): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // CHECK IF ANY FILTERS ARE ACTIVE

  const hasActiveFilters =
    selectedFilters.mealType.length > 0 ||
    selectedFilters.cuisine.length > 0 ||
    selectedFilters.diet.length > 0 ||
    selectedFilters.healthGoals.length > 0;

  // GET COLOR SCHEME FOR CATEGORY

  const getColorScheme = (category: keyof FilterState) => {
    switch (category) {
      case "mealType":
        return MEAL_TYPE_COLORS;
      case "cuisine":
        return CUISINE_COLORS;
      case "diet":
        return DIET_COLORS;
      case "healthGoals":
        return HEALTH_COLORS;
      default:
        return MEAL_TYPE_COLORS;
    }
  };

  // RENDER FILTER SECTION

  const renderFilterSection = (
    title: string,
    category: keyof FilterState,
    options: string[],
  ) => {
    const isExpanded = expandedSections[category];
    const colors = getColorScheme(category);

    return (
      <div className="pb-4 mb-4 border-b border-gray-200 last:border-b-0">
        {/* Section Header */}
        <button
          onClick={() => toggleSection(category)}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          {isExpanded ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </button>

        {/* Filter Options */}
        {isExpanded && (
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const isSelected = selectedFilters[category].includes(option);

              return (
                <button
                  key={option}
                  onClick={() => toggleFilter(category, option)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
                    ${isSelected ? colors.active : colors.inactive}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // RENDER ACTIVE FILTER BADGES

  const renderActiveFilters = () => {
    const allActive = [
      ...selectedFilters.mealType.map((f) => ({
        category: "mealType" as const,
        value: f,
      })),
      ...selectedFilters.cuisine.map((f) => ({
        category: "cuisine" as const,
        value: f,
      })),
      ...selectedFilters.diet.map((f) => ({
        category: "diet" as const,
        value: f,
      })),
      ...selectedFilters.healthGoals.map((f) => ({
        category: "healthGoals" as const,
        value: f,
      })),
    ];

    if (allActive.length === 0) return null;

    return (
      <div className="p-3 mb-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="mb-2 text-xs font-semibold text-gray-600">
          Active Filters:
        </p>
        <div className="flex flex-wrap gap-2">
          {allActive.map(({ category, value }) => {
            const colors = getColorScheme(category);

            return (
              <button
                key={`${category}-${value}`}
                onClick={() => toggleFilter(category, value)}
                className={`
                  inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium 
                  rounded-full border transition-all duration-200
                  ${colors.active}
                  hover:opacity-90
                `}
              >
                {value}
                <X size={12} />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // RENDER

  return (
    <aside className="flex-shrink-0 w-full lg:w-64">
      {/* Sticky container on desktop */}
      <div className="lg:sticky lg:top-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-red-600 transition hover:text-red-700"
            >
              <X size={16} />
              Clear all
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {renderActiveFilters()}

        {/* Filter Sections */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          {renderFilterSection("🍳 Meal Type", "mealType", MEAL_TYPES)}
          {renderFilterSection("🌍 Cuisine", "cuisine", CUISINES)}
          {renderFilterSection("🥗 Diet", "diet", DIETS)}
          {renderFilterSection("❤️ Health Goals", "healthGoals", HEALTH_GOALS)}
        </div>

        {/* Result Count */}
        <div className="p-3 mt-4 text-sm text-center border border-gray-200 rounded-lg bg-gray-50">
          <span className="font-semibold text-primary">{recipeCount}</span>{" "}
          {recipeCount === 1 ? "recipe" : "recipes"} found
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

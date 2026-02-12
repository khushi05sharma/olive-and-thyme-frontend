import { type FC } from "react";
import { Search, Sparkles, BookOpen, Utensils, Zap } from "lucide-react";

// HERO SECTION COMPONENT

const HeroSection: FC = () => {
  // Scroll to all recipes section
  const scrollToRecipes = (): void => {
    const element = document.getElementById("all-recipes");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-br from-pink-50 via-primary-light to-pink-100 sm:py-16 lg:py-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-orange-300/5 blur-3xl"></div>

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-red-800 border rounded-full bg-white/80 backdrop-blur-sm border-primary/10">
            <Sparkles size={16} className="text-primary" />
            Discover amazing recipes
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Find Recipes You'll <span className="text-primary">Love</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl pt-6 mx-auto mb-8 text-base text-gray-600 sm:text-lg lg:text-xl">
            Explore thousands of delicious recipes shared by our community. From
            quick weeknight dinners to elaborate weekend feasts.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm sm:gap-8 sm:text-base">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-green-600" />
              <span className="font-normal text-gray-700">5+ Recipes</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils size={20} className="text-primary" />
              <span className="font-normal text-gray-700">11 Cuisines</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              <span className="font-normal text-gray-700">Quick & Easy</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToRecipes}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white transition-all duration-200 rounded-lg shadow-lg bg-primary hover:bg-orange-600 hover:shadow-xl active:scale-95 sm:px-4 sm:py-3 sm:text-lg"
          >
            <Search size={20} />
            Browse Recipes
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

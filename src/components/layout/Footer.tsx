import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

// FOOTER COMPONENT

function Footer() {
  return (
    <footer className="mt-auto text-white bg-orange-900">
      {/* Main footer content */}

      <div className="px-4 py-8 mx-auto max-w-8xl sm:px-6 lg:px-12 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {/* SECTION 1: Brand */}

          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center mb-3 space-x-2 sm:mb-4">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-primary">
                <img
                  src={logo}
                  alt="Olive & Thyme logo"
                  className="object-contain w-10 h-10"
                />
              </div>
              <span className="text-lg font-bold sm:text-xl">
                Olive & Thyme
              </span>
            </div>

            {/* Description */}
            {/* Responsive text size */}
            <p className="max-w-md text-xs text-orange-300 sm:text-sm">
              Discover and share amazing recipes from around the world. Join our
              community of food lovers and home chefs.
            </p>
          </div>

          {/* SECTION 2: Quick Links */}

          <div>
            <h3 className="mb-3 text-base font-semibold sm:text-lg sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to="/"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Discover
                </Link>
              </li>
              <li>
                <Link
                  to="/add-recipe"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Add Recipe
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* SECTION 3: Categories */}

          <div>
            <h3 className="mb-3 text-base font-semibold sm:text-lg sm:mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to="/?category=breakfast"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Breakfast
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=lunch"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Lunch
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=dinner"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Dinner
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=dessert"
                  className="inline-block text-orange-300 transition hover:text-white"
                >
                  Dessert
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}

        <div className="pt-6 mt-6 border-t border-gray-700 sm:mt-8 sm:pt-8">
          <p className="text-xs text-center text-gray-300 sm:text-sm">
            © 2026 Olive & Thyme. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

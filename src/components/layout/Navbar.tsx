import { type FC, useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Plus,
  LayoutDashboard,
  Bell,
  Search,
  Menu,
  X,
  Bookmark,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

import logo from "../../assets/logo.png";

// NAVBAR COMPONENT

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState<number>(0);

  // CHANGE THIS to true or false to test both navbar states
  // Later this will come from AuthContext: const { isLoggedIn } = useAuth();

  {
    /* this do true to check after login navbar and false for login signup one */
  }
  const isLoggedIn: boolean = false;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);
  const closeProfile = () => setIsProfileOpen(false);

  // Measure the menu's scrollHeight so we can animate to it
  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [isMenuOpen, isLoggedIn]); // Added isLoggedIn so height recalculates when state changes

  // Active / inactive nav styles
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-6 py-3 rounded-xl transition-all duration-300
   ${
     isActive
       ? "bg-gradient-to-r from-[#FF8A00] to-[#FFA94D] text-white shadow-md"
       : "text-gray-700 hover:text-primary hover:bg-primary-light"
   }`;

  // Mobile NavLink style (reusable to avoid repetition)
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-primary text-white"
        : "text-gray-700 hover:bg-primary-light"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => {
              closeProfile();
              closeMenu();
            }}
          >
            <img
              src={logo}
              alt="Olive & Thyme logo"
              className="object-contain w-10 h-10"
            />
            <span className="hidden text-xl font-bold md:inline text-primary">
              Olive & Thyme
            </span>
          </Link>

          {/* CENTER: Search */}
          <div className="flex-1 hidden max-w-md mx-8 md:flex">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
              />
              <input
                type="text"
                placeholder="Search for recipes..."
                className="w-full py-2 pl-10 pr-4 border border-orange-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* RIGHT: Desktop & Tablet Nav */}
          <div className="relative items-center hidden space-x-4 md:flex">
            {/* Home — always visible */}
            <NavLink to="/" className={navLinkClasses}>
              <Home size={20} />
              <span className="hidden ml-1 lg:inline">Home</span>
            </NavLink>

            {/* CONDITIONAL: logged-in vs not logged-in */}

            {isLoggedIn ? (
              <>
                {/* Add Recipe */}
                <NavLink to="/add-recipe" className={navLinkClasses}>
                  <Plus size={20} />
                  <span className="hidden ml-1 lg:inline">Add Recipe</span>
                </NavLink>

                {/* Dashboard */}
                <NavLink to="/dashboard" className={navLinkClasses}>
                  <LayoutDashboard size={20} />
                  <span className="hidden ml-1 lg:inline">Dashboard</span>
                </NavLink>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="p-2 text-gray-700 transition rounded-lg hover:text-primary hover:bg-primary-light"
                >
                  <Bell size={22} />
                </Link>

                {/* AVATAR + DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center justify-center w-10 h-10 font-bold text-white transition rounded-full bg-primary hover:bg-orange-600"
                  >
                    S
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                      <Link
                        to="/dashboard"
                        onClick={closeProfile}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-primary-light"
                      >
                        <LayoutDashboard size={18} /> Dashboard
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={closeProfile}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-primary-light"
                      >
                        <Bookmark size={18} /> Saved Recipes
                      </Link>

                      <button
                        onClick={closeProfile}
                        className="flex items-center w-full gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 transition border border-gray-300 rounded-lg hover:border-primary hover:text-primary hover:bg-primary-light"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-primary hover:bg-orange-600"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE: Hamburger */}
          <button
            onClick={toggleMenu}
            className="text-gray-700 md:hidden hover:text-primary"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6" style={{ perspective: "800px" }}>
              {/* Menu icon */}
              <Menu
                size={26}
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              {/* Close icon */}
              <X
                size={26}
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU — smooth slide down/up */}
      <div
        ref={menuRef}
        className="overflow-hidden border-t border-gray-100 shadow-sm md:hidden"
        style={{
          maxHeight: isMenuOpen ? `${menuHeight}px` : "0px",
          opacity: isMenuOpen ? 1 : 0,
          transition:
            "max-height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease",
        }}
      >
        <div className="px-4 py-4 space-y-2">
          {/* Mobile Search Bar */}
          <div className="relative pb-2 border-b border-gray-200">
            <Search
              size={18}
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/3"
            />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {/* Home — always visible */}
          <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClasses}>
            <Home size={20} /> Home
          </NavLink>
          {/* MOBILE CONDITIONAL: logged-in vs not    */}
          {isLoggedIn ? (
            <>
              <NavLink
                to="/add-recipe"
                onClick={closeMenu}
                className={mobileNavLinkClasses}
              >
                <Plus size={20} /> Add Recipe
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={mobileNavLinkClasses}
              >
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>

              <NavLink
                to="/notifications"
                onClick={closeMenu}
                className={mobileNavLinkClasses}
              >
                <Bell size={20} /> Notifications
              </NavLink>

              {/* Logout */}
              <button
                onClick={closeMenu}
                className="flex items-center w-full gap-3 px-3 py-2 pt-3 text-left text-red-600 transition border-t border-gray-200 rounded-lg hover:bg-red-50"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 transition rounded-lg hover:bg-primary-light"
              >
                <LogIn size={20} /> Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 transition rounded-lg hover:bg-primary-light"
              >
                <UserPlus size={20} /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

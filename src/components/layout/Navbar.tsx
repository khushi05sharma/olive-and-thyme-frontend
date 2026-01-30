// // ============================================
// // IMPORTS
// // ============================================

// import { type FC, useState } from "react";
// import { Link, NavLink } from "react-router-dom";
// import {
//   Home,
//   Plus,
//   LayoutDashboard,
//   Bell,
//   Search,
//   Menu,
//   X,
//   Bookmark,
//   LogOut,
// } from "lucide-react";

// import logo from "../../assets/logo.png";

// // ============================================
// // NAVBAR COMPONENT
// // ============================================

// const Navbar: FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
//   const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

//   const toggleMenu = () => setIsMenuOpen((prev) => !prev);
//   const closeMenu = () => setIsMenuOpen(false);

//   const toggleProfile = () => setIsProfileOpen((prev) => !prev);
//   const closeProfile = () => setIsProfileOpen(false);

//   // ✅ Active / inactive nav styles
//   const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
//     `flex items-center p-2 rounded-lg transition
//      ${
//        isActive
//          ? "bg-primary text-white"
//          : "text-gray-700 hover:text-primary hover:bg-primary-light"
//      }`;

//   return (
//     <nav className="sticky top-0 z-50 bg-white shadow-sm">
//       <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* LEFT: Logo */}
//           <Link
//             to="/"
//             className="flex items-center space-x-2"
//             onClick={closeProfile}
//           >
//             <img
//               src={logo}
//               alt="Olive & Thyme logo"
//               className="object-contain w-10 h-10"
//             />
//             <span className="hidden text-xl font-bold md:inline text-primary">
//               Olive & Thyme
//             </span>
//           </Link>

//           {/* CENTER: Search */}
//           <div className="flex-1 hidden max-w-md mx-8 md:flex">
//             <div className="relative w-full">
//               <Search
//                 size={18}
//                 className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
//               />
//               <input
//                 type="text"
//                 placeholder="Search for recipes..."
//                 className="w-full py-2 pl-10 pr-4 border border-orange-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* RIGHT: Desktop & Tablet Nav */}
//           <div className="relative items-center hidden space-x-4 md:flex">
//             <NavLink to="/" className={navLinkClasses}>
//               <Home size={20} />
//               <span className="hidden ml-1 lg:inline">Home</span>
//             </NavLink>

//             <NavLink to="/add-recipe" className={navLinkClasses}>
//               <Plus size={20} />
//               <span className="hidden ml-1 lg:inline">Add Recipe</span>
//             </NavLink>

//             <NavLink to="/dashboard" className={navLinkClasses}>
//               <LayoutDashboard size={20} />
//               <span className="hidden ml-1 lg:inline">Dashboard</span>
//             </NavLink>

//             {/* Notifications (not active-tracked) */}
//             <Link
//               to="/notifications"
//               className="p-2 text-gray-700 transition rounded-lg hover:text-primary hover:bg-primary-light"
//             >
//               <Bell size={22} />
//             </Link>

//             {/* AVATAR + DROPDOWN */}
//             <div className="relative">
//               <button
//                 onClick={toggleProfile}
//                 className="flex items-center justify-center w-10 h-10 font-bold text-white transition rounded-full bg-primary hover:bg-orange-600"
//               >
//                 S
//               </button>

//               {isProfileOpen && (
//                 <div className="absolute right-0 w-48 mt-2 bg-white border rounded-lg shadow-lg">
//                   <Link
//                     to="/dashboard"
//                     onClick={closeProfile}
//                     className="flex items-center gap-3 px-4 py-2 hover:bg-primary-light"
//                   >
//                     <LayoutDashboard size={18} /> Dashboard
//                   </Link>

//                   <Link
//                     to="/dashboard"
//                     onClick={closeProfile}
//                     className="flex items-center gap-3 px-4 py-2 hover:bg-primary-light"
//                   >
//                     <Bookmark size={18} /> Saved Recipes
//                   </Link>

//                   <button
//                     onClick={closeProfile}
//                     className="flex items-center w-full gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50"
//                   >
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* MOBILE: Hamburger */}
//           <button
//             onClick={toggleMenu}
//             className="text-gray-700 md:hidden hover:text-primary"
//             aria-label="Toggle menu"
//           >
//             {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {isMenuOpen && (
//         <div className="bg-white border-t shadow-sm md:hidden">
//           <div className="px-4 py-4 space-y-3">
//             {/* Mobile Search Bar */}
//             <div className="relative pb-3 border-b border-gray-200">
//               <Search
//                 size={18}
//                 className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
//               />
//               <input
//                 type="text"
//                 placeholder="Search recipes..."
//                 className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>

//             {/* Home */}
//             <NavLink
//               to="/"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
//                   isActive
//                     ? "bg-primary text-white"
//                     : "text-gray-700 hover:bg-primary-light"
//                 }`
//               }
//             >
//               <Home size={20} /> Home
//             </NavLink>

//             {/* Add Recipe */}
//             <NavLink
//               to="/add-recipe"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
//                   isActive
//                     ? "bg-primary text-white"
//                     : "text-gray-700 hover:bg-primary-light"
//                 }`
//               }
//             >
//               <Plus size={20} /> Add Recipe
//             </NavLink>

//             {/* Dashboard */}
//             <NavLink
//               to="/dashboard"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
//                   isActive
//                     ? "bg-primary text-white"
//                     : "text-gray-700 hover:bg-primary-light"
//                 }`
//               }
//             >
//               <LayoutDashboard size={20} /> Dashboard
//             </NavLink>

//             {/* Notifications */}
//             <NavLink
//               to="/notifications"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
//                   isActive
//                     ? "bg-primary text-white"
//                     : "text-gray-700 hover:bg-primary-light"
//                 }`
//               }
//             >
//               <Bell size={20} /> Notifications
//             </NavLink>

//             {/* Logout */}
//             <button
//               onClick={closeMenu}
//               className="flex items-center w-full gap-3 px-3 py-2 pt-3 text-left text-red-600 transition border-t border-gray-200 rounded-lg hover:bg-red-50"
//             >
//               <LogOut size={20} /> Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import { type FC, useState } from "react";
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
  Divide,
} from "lucide-react";
import logo from "../../assets/logo.png";

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);
  const closeProfile = () => setIsProfileOpen(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-lg transition
 ${
   isActive
     ? "bg-primary text-white"
     : "text-gray-700 hover:text-primary hover:bg-primary-light"
 }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeProfile}
          >
            <img
              src={logo}
              alt="olive & thyme"
              className="object-contain w-10 h-10"
            />
            <span className="hidden text-xl font-bold text-orange-600 md:inline">
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
                placeholder="Search for the Recipes..."
                className="w-full py-2 pl-10 pr-4 border border-orange-300 rounded-2xl focus:outline-orange-800"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

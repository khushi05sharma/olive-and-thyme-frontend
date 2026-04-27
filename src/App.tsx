// Import routing components from react-router-dom
import {Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import TestComponents from "./pages/TestComponents";
import TestRecipeCard from "./pages/TestRecipeCard";

//Import all page components
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipeDetail from "./pages/RecipeDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    
      <Layout>
        <Routes>
          {/* element prop specifies which component to render */}
          <Route path="/" element={<Home />} />
          {/* :id is a URL parameter (dynamic segment) */}
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<AddRecipe />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/test" element={<TestComponents />} />
          <Route path="/test-card" element={<TestRecipeCard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Layout>
  
  );
}

export default App;

// Import routing components from react-router-dom
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from './components/layout/Layout';
import TestComponents from './pages/TestComponents';
import TestRecipeCard from './pages/TestRecipeCard';

//Import all page components
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipeDetail from "./pages/RecipeDetail";

function App() {
  return (
    <BrowserRouter>
      {/* React Router will match the current URL to ONE of these routes */}
      <Layout>
      <Routes>
        {/* element prop specifies which component to render */}
        <Route path="/" element={<Home />} />
        {/* :id is a URL parameter (dynamic segment) */}
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/test" element={<TestComponents />} />
        <Route path="/test-card" element={<TestRecipeCard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

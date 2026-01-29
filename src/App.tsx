import { BrowserRouter, Route, Routes } from "react-router-dom";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

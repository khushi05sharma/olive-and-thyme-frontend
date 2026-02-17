import HeroSection from "../components/home/HeroSection";
import { mockRecipes } from "../data/mockRecipes";

import TrendingSection from "../components/home/TrendingSection";
 const trendingRecipes = mockRecipes.slice(0, 4);
const Home = () => {
  return (
    <main>
<HeroSection/>
<TrendingSection recipes={trendingRecipes} />
    </main>
  );
};

export default Home;

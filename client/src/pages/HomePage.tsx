import Categories from "../components/Categories/Categories";
import Branding from "../components/Branding/Branding";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import BeastDeals from "../components/BestDeals/BeastDeals";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import Events from "../components/Events/Events";
import Sponsored from "../components/Sponsored/Sponsored";
import Footer from "../components/Footer/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Branding />
      <Categories />
      <BeastDeals />
      <Events />
      <FeaturedProducts />
      <Sponsored />
    </>
  );
}

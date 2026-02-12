import React, { useEffect, useRef, useState } from "react";
import Nav from "../../shared/Nav";
import { categories } from "../../category";
import CategoryCard from "../../components/User/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import FoodCard from "../../components/User/FoodCard";
import { useNavigate } from "react-router";

const UserDashboard = () => {
  const { currentCity, shopInMyCity, itemsInMyCity } = useSelector(
    (state) => state?.user,
  );
  const navigate = useNavigate();
  const catSliderRef = useRef(null);
  const catIntervalRef = useRef(null);
  const [catCanLeft, setCatCanLeft] = useState(false);
  const [catCanRight, setCatCanRight] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filterList = itemsInMyCity?.filter(
        (i) => i.category?.toLowerCase() === category.toLowerCase(),
      );
      setUpdatedItemsList(filterList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const checkCatScroll = () => {
    const slider = catSliderRef.current;
    if (!slider) return;
    setCatCanLeft(slider.scrollLeft > 0);
    setCatCanRight(slider.scrollLeft + slider.clientWidth < slider.scrollWidth);
  };

  const scrollCatLeft = () => {
    catSliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };
  const scrollCatRight = () => {
    catSliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };

  const startCatAutoScroll = () => {
    stopCatAutoScroll();
    catIntervalRef.current = setInterval(() => {
      const slider = catSliderRef.current;
      if (!slider) return;
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 3000);
  };
  const stopCatAutoScroll = () => {
    if (catIntervalRef.current) clearInterval(catIntervalRef.current);
  };
  // --- SHOP SLIDER ---
  const shopSliderRef = useRef(null);
  const shopIntervalRef = useRef(null);
  const [shopCanLeft, setShopCanLeft] = useState(false);
  const [shopCanRight, setShopCanRight] = useState(false);

  const checkShopScroll = () => {
    const slider = shopSliderRef.current;
    if (!slider) return;
    setShopCanLeft(slider.scrollLeft > 0);
    setShopCanRight(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth,
    );
  };

  const scrollShopLeft = () => {
    shopSliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };
  const scrollShopRight = () => {
    shopSliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };

  const startShopAutoScroll = () => {
    stopShopAutoScroll();
    shopIntervalRef.current = setInterval(() => {
      const slider = shopSliderRef.current;
      if (!slider) return;
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 3000);
  };
  const stopShopAutoScroll = () => {
    if (shopIntervalRef.current) clearInterval(shopIntervalRef.current);
  };

  useEffect(() => {
    checkCatScroll();
    checkShopScroll();
    startCatAutoScroll();
    startShopAutoScroll();
    return () => {
      stopCatAutoScroll();
      stopShopAutoScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  return (
    <>
      <Nav />

      {/* ------------------ CATEGORY SLIDER ------------------ */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-3">
        <h1 className="text-3xl md:text-2xl text-gray-800">
          Inspiration Your Fast Order
        </h1>

        <div className="relative w-full">
          {/* Left */}
          <button
            onClick={scrollCatLeft}
            disabled={!catCanLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full p-2 border transition
              ${
                catCanLeft
                  ? "bg-white cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-gray-100 opacity-40 cursor-not-allowed"
              }`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Slider */}
          <div
            ref={catSliderRef}
            onScroll={checkCatScroll}
            onMouseEnter={stopCatAutoScroll}
            onMouseLeave={startCatAutoScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-3 px-3 md:px-12"
          >
            {categories?.length > 0 &&
              categories.map((category, i) => (
                <CategoryCard
                  key={i}
                  handleClick={() => handleFilterByCategory(category.category)}
                  name={category.category}
                  image={category.image}
                />
              ))}
          </div>

          {/* Right */}
          <button
            onClick={scrollCatRight}
            disabled={!catCanRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full p-2 border transition
              ${
                catCanRight
                  ? "bg-white cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-gray-100 opacity-40 cursor-not-allowed"
              }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* ------------------ SHOP SLIDER ------------------ */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-3 mt-8">
        <h1 className="text-3xl md:text-2xl text-gray-800">
          Best Shop in {currentCity}
        </h1>

        <div className="relative w-full">
          {/* Left */}
          <button
            onClick={scrollShopLeft}
            disabled={!shopCanLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full p-2 border transition
              ${
                shopCanLeft
                  ? "bg-white cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-gray-100 opacity-40 cursor-not-allowed"
              }`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Slider */}
          <div
            ref={shopSliderRef}
            onScroll={checkShopScroll}
            onMouseEnter={stopShopAutoScroll}
            onMouseLeave={startShopAutoScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-3 px-3 md:px-12"
          >
            {shopInMyCity?.length > 0 &&
              shopInMyCity.map((category, i) => (
                <CategoryCard
                  key={i}
                  handleClick={() => navigate(`/shopBy/${category._id}`)}
                  name={category.name}
                  image={category.image}
                />
              ))}
          </div>

          {/* Right */}
          <button
            onClick={scrollShopRight}
            disabled={!shopCanRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full p-2 border transition
              ${
                shopCanRight
                  ? "bg-white cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-gray-100 opacity-40 cursor-not-allowed"
              }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      {/* ------------------ Items ------------------ */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-3">
        <h2 className="text-3xl md:text-2xl text-gray-800">
          Suggested Food Items
        </h2>
        <div className="w-full h-auto flex flex-wrap gap-7 justify-center">
          {updatedItemsList?.length > 0 ? (
            updatedItemsList.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))
          ) : (
            <div className="flex flex-col items-center gap-4 py-10">
              <p className="text-gray-500 text-sm">No items found</p>

              <button
                onClick={() => setUpdatedItemsList(itemsInMyCity)}
                className="px-6 cursor-pointer py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition duration-300 shadow-md"
              >
                Show All Items
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

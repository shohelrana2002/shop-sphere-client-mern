import React, { useEffect, useRef, useState } from "react";
import Nav from "../../shared/Nav";
import { categories } from "../../category";
import CategoryCard from "../../components/User/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const UserDashboard = () => {
  /*  Scrollbar Add */
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // check scroll position
  const checkScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollLeft(slider.scrollLeft > 0);
    setCanScrollRight(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth
    );
  };

  // auto scroll
  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      if (!sliderRef.current) return;

      if (
        sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
        sliderRef.current.scrollWidth
      ) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    checkScroll();
    startAutoScroll();
    return () => stopAutoScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };
  return (
    //className="w-full min-h-screen flex flex-col overflow-y-auto  gap-5  items-center bg-linear-to-b from-green-100 to-green-200/20"
    <>
      <Nav />
      <div className="w-full max-w-6xl  flex flex-col  gap-5  items-start p-3">
        <h1 className="text-3xl md:text-2xl text-gray-800">
          Inspiration Your Fast Order{" "}
        </h1>
        {/* scrollbar */}
        <div className="relative w-full">
          {/* Left Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10
        hidden md:flex rounded-full p-2 border transition
        ${
          canScrollLeft
            ? "bg-white cursor-pointer shadow-md hover:shadow-lg"
            : "bg-gray-100 opacity-40 cursor-not-allowed"
        }`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            onScroll={checkScroll}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth
        scrollbar-hide pb-3 px-3 md:px-12"
          >
            {categories.map((category, i) => (
              <CategoryCard key={i} data={category} />
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10
        hidden md:flex rounded-full p-2 border transition
        ${
          canScrollRight
            ? "bg-white cursor-pointer shadow-md hover:shadow-lg"
            : "bg-gray-100 opacity-40 cursor-not-allowed"
        }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

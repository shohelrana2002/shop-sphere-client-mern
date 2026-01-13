import React from "react";

const FoodCard = ({ data }) => {
  return (
    <div className="group w-62.5 sm:w-55 md:w-60 lg:w-65 bg-white rounded-2xl border border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={data?.image}
          alt={data?.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Category Badge */}
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          {data?.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <h3 className="text-base font-semibold text-gray-800 truncate">
          {data?.name}
        </h3>

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-bold text-orange-600">৳ {data?.price}</p>

          {data?.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

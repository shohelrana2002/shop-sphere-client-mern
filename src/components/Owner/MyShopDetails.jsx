import React from "react";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router";
import { FaUtensils, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import OwnerItemsCard from "./OwnerItemsCard";

const MyShopDetails = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  if (!myShopData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading shop details...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-orange-50 to-white py-4 px-4">
      {/* Page Heading */}
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-5xl font-extrabold text-gray-800 flex justify-center items-center gap-3">
          <FaUtensils className="text-orange-500" />
          Welcome to <span className="text-orange-500">{myShopData.name}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your restaurant and food items easily
        </p>
      </div>

      {/* Main Card */}
      <div className="mx-auto w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="relative group">
          <img
            src={myShopData.image}
            alt={myShopData.name}
            className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />

          {/* Edit Button */}
          <button
            onClick={() => navigate("/create-edit-shop")}
            className="absolute top-5 right-5 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all"
          >
            <FiEdit2 size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {/* Shop Info */}
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {myShopData.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                {myShopData.address}
              </p>
              <p className="flex items-center gap-2">
                <FaCity className="text-orange-500" />
                {myShopData.city}, {myShopData.state}
              </p>
            </div>
          </div>
          {myShopData?.items &&
            myShopData?.items?.map((item, index) => (
              <OwnerItemsCard key={index} data={item} />
            ))}

          {!myShopData?.items?.length > 0 && (
            <div className="flex justify-center">
              <div className="w-full max-w-md bg-linear-to-br from-orange-50 to-white rounded-3xl border border-orange-200 p-8 text-center shadow-lg">
                <div className="mx-auto mb-5 w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <FaUtensils size={28} />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No Food Items Yet
                </h2>

                <p className="text-gray-500 text-sm mb-6">
                  Start adding delicious food items to attract more customers.
                </p>

                <button
                  onClick={() => navigate("/add-food-item")}
                  className="w-full py-3 cursor-pointer rounded-xl bg-linear-to-r from-orange-400 to-orange-600 
                    text-white font-semibold tracking-wide hover:from-orange-500 hover:to-orange-700 
                    transition-all shadow-md hover:shadow-xl"
                >
                  Add Food Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyShopDetails;

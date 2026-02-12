import { useNavigate } from "react-router";
import { FaUtensils } from "react-icons/fa";

const Title = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center px-4 pt-28 pb-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-orange-100 p-8 text-center hover:shadow-xl transition-all duration-300">
          {/* Icon */}
          <div className="mx-auto mb-5 w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <FaUtensils size={30} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Add Your Restaurant
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Start selling your delicious food online. Add your restaurant
            details, menu items, and manage orders easily.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/create-edit-shop")}
            className="w-full cursor-pointer py-3 rounded-xl bg-linear-to-r from-orange-400 to-orange-500 
              text-white font-semibold tracking-wide hover:from-orange-500 hover:to-orange-600 
              transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Title;

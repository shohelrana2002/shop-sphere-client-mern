import { FaRegStar, FaStar } from "react-icons/fa6";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCard, removeFromCart } from "../../redux/userSlice";

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();

  // Render stars
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </span>,
      );
    }
    return stars;
  };

  // Add to cart first time
  const handleAddClick = () => {
    setQuantity(1);
    dispatch(
      addToCard({
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity: 1,
        stock: data.stock,
      }),
    );
  };

  // Increment
  const increment = () => {
    if (quantity < data.stock) {
      setQuantity((prev) => prev + 1);
      dispatch(
        addToCard({
          id: data._id,
          quantity: 1, // increase by 1
        }),
      );
    }
  };

  // Decrement
  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      dispatch(
        addToCard({
          id: data._id,
          quantity: -1, // decrease by 1
        }),
      );
    } else {
      // quantity 1 → 0
      setQuantity(0);
      dispatch(removeFromCart(data._id));
    }
  };

  return (
    <div
      className="group w-full sm:w-52 md:w-56 lg:w-60 bg-white rounded-xl border border-orange-200
      shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-full md:h-36 w-full overflow-hidden">
        <img
          src={data?.image}
          alt={data?.name}
          className="h-full p-2 rounded-2xl w-full object-cover
            group-hover:scale-110 transition-transform duration-500"
        />

        <span
          className="absolute top-0 left-2 bg-orange-500 text-white text-[10px]
          font-semibold px-2 py-0.5 rounded-full shadow"
        >
          {data?.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {data?.name}
        </h3>

        {/* Rating */}
        {data?.rating != null && (
          <div className="flex items-center gap-0.5 text-[11px]">
            {renderStars(data.rating)}
            <span className="text-gray-500">({data?.reviews || 0})</span>
          </div>
        )}

        {/* Price + Stock */}
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-orange-600">৳ {data?.price}</p>

          {data?.stock > 0 ? (
            <span className="text-[10px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
              Out
            </span>
          )}
        </div>

        {/* Quantity / Add to Cart */}
        {data?.stock > 0 && quantity === 0 && (
          <button
            onClick={handleAddClick}
            className="flex justify-center cursor-pointer items-center gap-2 w-full py-1.5
              text-sm bg-orange-500 text-white rounded-lg font-semibold
              hover:bg-orange-600 hover:scale-[1.03] transition-all"
          >
            Add to Cart <ShoppingBag size={16} />
          </button>
        )}

        {data?.stock > 0 && quantity > 0 && (
          <div className="flex items-center justify-center gap-2 mt-1">
            <button
              onClick={decrement}
              className="w-7 h-7 cursor-pointer rounded-md bg-gray-200 text-gray-700
                hover:bg-gray-300 transition text-sm font-semibold"
            >
              −
            </button>

            <span className="text-sm font-medium text-gray-800">
              {quantity}
            </span>

            <button
              onClick={increment}
              className="w-7 h-7 cursor-pointer rounded-md bg-gray-200 text-gray-700
                hover:bg-gray-300 transition text-sm font-semibold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;

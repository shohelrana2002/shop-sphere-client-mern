import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { addToCard, removeFromCart } from "../../redux/userSlice";
import { useNavigate } from "react-router";

const CartPage = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const totalPrice = cartItems.reduce(
  //     (acc, item) => acc + item.price * item.quantity,
  //     0,
  //   );

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen w-full
    bg-linear-to-br from-orange-100 via-orange-50 to-white"
      >
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-2xl">🛒 Your cart is empty</p>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 text-orange-600 font-medium hover:underline"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-orange-50 to-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-orange-600 transition"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white rounded-xl border border-orange-300/60 p-3 shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-orange-600 font-bold">৳ {item.price}</p>
                <p className=" text-black font-bold">
                  <span className="text-orange-400"> Quantity</span>{" "}
                  {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    dispatch(
                      item.quantity > 1
                        ? addToCard({ id: item.id, quantity: -1 })
                        : removeFromCart(item.id),
                    )
                  }
                  className="w-8  cursor-pointer h-8 flex items-center justify-center  bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  <Minus size={16} />
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(addToCard({ id: item.id, quantity: 1 }))
                  }
                  className="w-8 h-8 cursor-pointer flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-red-500 cursor-pointer hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 flex justify-between items-center bg-orange-50 p-4 rounded-xl">
          <p className="text-lg font-semibold text-gray-800">Total:</p>
          <p className="text-xl font-bold text-orange-600">৳ {totalAmount}</p>
        </div>

        {/* Checkout */}
        <button
          onClick={() => navigate("/checkout")}
          className="mt-4 cursor-pointer w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;

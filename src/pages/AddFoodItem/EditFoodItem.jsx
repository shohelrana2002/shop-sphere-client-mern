import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { serverURL } from "../../App";
import { setMyShopData } from "../../redux/OwnerSlice";

const categories = [
  "Tea",
  "Coffee",
  "Juice",
  "Soft Drinks",
  "Samosa",
  "Piyaju",
  "Chop",
  "Fried Snacks",
  "Burger",
  "Pizza",
  "French Fries",
  "Sandwich",
  "Plain Rice",
  "Khichuri",
  "Chicken Curry",
  "Beef Curry",
  "Fish Curry",
  "Vegetable Curry",
  "Rasgulla",
  "Sandesh",
  "Mishti Doi",
  "Cham Cham",
  "Seasonal Fruits",
  "Vegetables",
  "Others",
];

const FoodItemForm = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!itemId);
  const [preview, setPreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Prefill data if Edit mode
  useEffect(() => {
    if (!itemId) return;

    const fetchItem = async () => {
      try {
        const { data } = await axios.get(
          `${serverURL}/api/item/get-item/${itemId}`,
          { withCredentials: true },
        );
        // Default Value
        reset({
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
        });
        setPreview(data.image); // Default image preview
      } catch (err) {
        console.error(err);
        toast.error("Failed to load item data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchItem();
  }, [itemId, reset]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData) => {
    if (!myShopData?._id) return toast.error("Shop data not available");

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("stock", formData.stock);
      payload.append("shop", myShopData._id);
      if (backendImage) payload.append("image", backendImage);

      let result;
      if (itemId) {
        result = await axios.put(
          `${serverURL}/api/item/edit-item/${itemId}`,
          payload,
          { withCredentials: true },
        );
      } else {
        result = await axios.post(`${serverURL}/api/item/add-item`, payload, {
          withCredentials: true,
        });
      }

      if (result.status === 200 || result.status === 201) {
        toast.success(itemId ? "Food item updated 🍽️" : "Food item added 🍽️");
        const shopRes = await axios.get(`${serverURL}/api/shop/get-myShop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(shopRes.data));
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-500">
        <CgSpinner className="animate-spin mr-2" /> Loading item...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-3">
            <FaUtensils size={30} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {itemId ? "Edit Food Item" : "Add New Food Item"}
          </h2>
          <p className="text-gray-500 text-sm">
            {itemId
              ? "Default values shown. Edit if you want."
              : "Fill in the details to add a new food item"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Food Name
            </label>
            <input
              {...register("name", { required: "Food name is required" })}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter food name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price (৳)
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register("stock", { required: "Stock is required" })}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Food Image
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-300 rounded-xl p-6 cursor-pointer hover:bg-orange-50 transition">
              <FiUpload className="text-3xl text-orange-500 mb-1" />
              <span className="text-sm text-gray-500">Upload food image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image")}
                onChange={handleImagePreview}
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-44 w-full object-cover rounded-xl shadow"
              />
            )}
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed shadow-lg transition"
          >
            {loading ? (
              <CgSpinner size={24} className="mx-auto animate-spin" />
            ) : itemId ? (
              "Update Item"
            ) : (
              "Add Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodItemForm;

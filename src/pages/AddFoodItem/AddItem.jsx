import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../../App";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
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

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("shop", myShopData?._id);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverURL}/api/item/add-item`,
        formData,
        { withCredentials: true },
      );
      console.log(result?.data);
      if (result.status === 201 || result.status === 200) {
        toast.success("Food item added successfully 🍽️");
        dispatch(setMyShopData(result.data));
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-4"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-3">
            <FaUtensils size={30} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Add Food Item</h2>
          <p className="text-gray-500 text-sm">
            Add delicious food to your restaurant
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="label">Food Name</label>
            <input
              {...register("name", { required: "Food name is required" })}
              className="input"
              placeholder="Food Item Name"
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="input"
            >
              <option>Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="error">{errors.category.message}</p>
            )}
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Price (৳)</label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="input"
                placeholder="Enter Price"
              />
              {errors.price && <p className="error">{errors.price.message}</p>}
            </div>

            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                {...register("stock", { required: "Stock is required" })}
                className="input"
                placeholder="Stock"
              />
              {errors.stock && <p className="error">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="label">Food Image</label>
            <label className="upload-box">
              <FiUpload className="text-3xl text-orange-500" />
              <span className="text-sm text-gray-500">Upload food image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", { required: "Image is required" })}
                onChange={handleImagePreview}
              />
            </label>
            {errors.image && <p className="error">{errors.image.message}</p>}

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
            className={`w-full bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg transition 
    ${loading ? "cursor-not-allowed bg-orange-400" : "hover:bg-orange-600 cursor-pointer"}`}
          >
            {loading ? (
              <CgSpinner size={24} className="mx-auto animate-spin" />
            ) : (
              "Add Item"
            )}
          </button>
        </form>
      </div>

      {/* Tailwind helpers */}
      <style>
        {`
          .label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; display:block }
          .input { width:100%; padding:0.65rem 1rem; border-radius:0.75rem; border:1px solid #d1d5db; outline:none }
          .input:focus { border-color:#fb923c; box-shadow:0 0 0 2px #fed7aa }
          .error { color:#ef4444; font-size:0.8rem; margin-top:0.25rem }
          .upload-box { display:flex; flex-direction:column; align-items:center; gap:0.5rem; border:2px dashed #fdba74; padding:1.5rem; border-radius:1rem; cursor:pointer }
          .upload-box:hover { background:#fff7ed }
        `}
      </style>
    </div>
  );
};

export default AddItem;

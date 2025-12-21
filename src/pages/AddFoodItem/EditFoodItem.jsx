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

const EditFoodItem = () => {
  const { itemId } = useParams();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(
          `${serverURL}/api/item/get-item/${itemId}`
        );
        reset({
          // set default values
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
        });
        setPreview(data.image); // show current image
        setLoadingData(false);
      } catch (error) {
        console.log(error);
        setLoadingData(false);
      }
    };
    fetchSingleData();
  }, [itemId, reset]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("stock", formData.stock);
      payload.append("shop", myShopData?._id);

      if (backendImage) payload.append("image", backendImage);

      const result = await axios.put(
        `${serverURL}/api/item/edit-item/${itemId}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (result.status === 200 || result.status === 201) {
        toast.success("Food item updated successfully 🍽️");
        const shopRes = await axios.get(`${serverURL}/api/shop/get-myShop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(shopRes?.data));
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-500">
        Loading item...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center py-10 px-4">
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
          <h2 className="text-3xl font-bold text-gray-800">Update Food Item</h2>
          <p className="text-gray-500 text-sm">
            Edit details of your food item
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
              placeholder="Chicken Biryani"
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
              <option value="">Select category</option>
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
                placeholder="250"
              />
              {errors.price && <p className="error">{errors.price.message}</p>}
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                {...register("stock", { required: "Stock is required" })}
                className="input"
                placeholder="10"
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
            className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition"
          >
            {loading ? (
              <CgSpinner size={24} className="mx-auto animate-spin" />
            ) : (
              "Update Item"
            )}
          </button>
        </form>

        {/* Tailwind helpers */}
        <style>
          {`
          .label { font-size:0.875rem; font-weight:500; color:#374151; margin-bottom:0.25rem; display:block }
          .input { width:100%; padding:0.65rem 1rem; border-radius:0.75rem; border:1px solid #d1d5db; outline:none }
          .input:focus { border-color:#fb923c; box-shadow:0 0 0 2px #fed7aa }
          .error { color:#ef4444; font-size:0.8rem; margin-top:0.25rem }
          .upload-box { display:flex; flex-direction:column; align-items:center; gap:0.5rem; border:2px dashed #fdba74; padding:1.5rem; border-radius:1rem; cursor:pointer }
          .upload-box:hover { background:#fff7ed }
        `}
        </style>
      </div>
    </div>
  );
};

export default EditFoodItem;

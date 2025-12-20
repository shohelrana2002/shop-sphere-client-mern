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

const CreateEditShop = () => {
  const [loading, setLoading] = useState(false);
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: myShopData?.name || "",
      city: myShopData?.city || currentCity,
      state: myShopData?.state || currentState,
      address: myShopData?.address || currentAddress,
    },
  });
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setPreview(URL.createObjectURL(file) || myShopData?.image);
    }
  };

  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("address", data.address);

      //  image must be file
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverURL}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (result?.status === 201 || result?.status === 200) {
        toast.success("Shop Created or Updated Success");
        dispatch(setMyShopData(result?.data));
        navigate("/", { replace: true });
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-orange-500 mb-2"
        >
          <FiArrowLeft />
          Back
        </button>

        {/* Title */}
        <div className="mx-auto mb-5 w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <FaUtensils size={30} />
        </div>

        {/* Title */}
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-2">
          {myShopData ? "Edit Your Shop" : " Add Your Restaurant"}
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-orange-100"
        >
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              {...register("name", { required: "Shop name is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
      focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              placeholder="Enter shop name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                {...register("city", { required: "City is required" })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
        focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                placeholder="City"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                {...register("state", { required: "State is required" })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
        focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                placeholder="State"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              {...register("address", { required: "Address is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
      focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
              placeholder="Full address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Image
            </label>

            <label
              className="flex flex-col items-center justify-center gap-2 
      border-2 border-dashed border-orange-300 rounded-xl p-6 
      cursor-pointer hover:bg-orange-50 transition"
            >
              <FiUpload className="text-3xl text-orange-500" />
              <span className="text-sm text-gray-500">
                Click to upload shop image
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", { required: "Image is required" })}
                onChange={handleImagePreview}
              />
            </label>

            {errors.image && (
              <p className="mt-1 text-sm text-red-500">
                {errors.image.message}
              </p>
            )}

            {/* Image Preview */}
            {preview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Preview</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-44 w-full object-cover rounded-xl border shadow-sm"
                />
              </div>
            )}
            {myShopData?.image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Old Image</p>
                <img
                  src={myShopData?.image}
                  alt="Preview"
                  className="h-44 w-full object-cover rounded-xl border shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 
    text-white py-3 rounded-xl font-semibold 
    shadow-md hover:shadow-lg transition"
          >
            {loading ? (
              <CgSpinner size={24} className="mx-auto animate-spin" />
            ) : (
              "Save Shop"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;

import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const OwnerItemsCard = ({ data }) => {
  const { loadingOwner } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  if (loadingOwner) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl mb-2 border-2 border-orange-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col  sm:flex-row gap-4">
      {/* Image Left */}
      <div className="shrink-0 w-full sm:w-1/3 overflow-hidden rounded-xl">
        <img
          src={data.image}
          alt={data.name}
          className="h-40 w-full object-cover"
        />
      </div>
      <div className="px-0 md:px-20">
        <h4 className="font-semibold text-gray-800 text-lg">{data.name}</h4>
        <p className="text-sm text-gray-500 mt-1">
          Category: <span className="font-medium">{data.category}</span>
        </p>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">
            ৳ {data.price}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            Stock: {data.stock}
          </span>
        </div>
      </div>
      {/* Info Right */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Edit & Delete Icons */}
        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={() => navigate(`/edit-food-item/${data?._id}`)}
            className="p-2 rounded-full cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
            title="Edit Item"
          >
            <FaEdit size={14} />
          </button>
          <button
            className="p-2 rounded-full cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 transition"
            title="Delete Item"
          >
            <FaTrashAlt size={14} />
          </button>
        </div>

        {/* Info */}
      </div>
    </div>
  );
};

export default OwnerItemsCard;

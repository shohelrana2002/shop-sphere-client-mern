import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { serverURL } from "../../App";
import { setMyShopData } from "../../redux/OwnerSlice";

const OwnerItemsCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);

  const handleDelete = async (itemId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    //  Optimistic UI
    const previousItems = myShopData.items;
    const updatedItems = previousItems.filter((item) => item._id !== itemId);

    dispatch(
      setMyShopData({
        ...myShopData,
        items: updatedItems,
      })
    );

    try {
      await axios.delete(`${serverURL}/api/item/delete-item/${itemId}`, {
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Food item deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      //  Rollback UI if API fails
      dispatch(
        setMyShopData({
          ...myShopData,
          items: previousItems,
        })
      );

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not delete item. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl mb-4 border border-orange-100 shadow-sm hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4">
      {/* Image */}
      <div className="w-full sm:w-1/3 rounded-xl overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="h-40 w-full object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{data.name}</h3>

          <p className="text-sm text-gray-500 mt-1">
            Category: <span className="font-medium">{data.category}</span>
          </p>

          <div className="flex gap-3 mt-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold">
              ৳ {data.price}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              Stock: {data.stock}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => navigate(`/edit-food-item/${data._id}`)}
            className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
            title="Edit Item"
          >
            <FaEdit size={15} />
          </button>

          <button
            onClick={() => handleDelete(data._id)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
            title="Delete Item"
          >
            <FaTrashAlt size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemsCard;

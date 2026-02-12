import axios from "axios";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { serverURL } from "../../App";
import { MapPin, Package, ShoppingCart } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import FoodCard from "./FoodCard";

const Shop = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const { data } = await axios.get(
        `${serverURL}/api/item/get-by-shop-id/${shopId}`,
        { withCredentials: true },
      );
      setShop(data.shop);
      setItems(data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) handleShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading shop...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 ">
      <button
        onClick={() => navigate(-1)}
        className="flex my-4 cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-white   shadow-sm border  text-gray-700  hover:bg-orange-50 hover:text-orange-600 transition"
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      {/* ===== SHOP HEADER ===== */}
      <div className="relative h-72 w-full">
        <img
          src={shop?.image}
          alt={shop?.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold">{shop?.name}</h1>
          <p className="text-sm flex items-center gap-1 mt-1">
            <MapPin size={14} />
            {shop?.address}
          </p>
        </div>
      </div>

      {/* ===== SHOP INFO BAR ===== */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-4">
        <span className="px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
          {shop?.city}
        </span>
        <span className="px-4 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium flex items-center gap-1">
          <Package size={14} /> {items.length} Items
        </span>
      </div>

      {/* ===== ITEMS GRID ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            No items available in this shop
          </p>
        ) : (
          <>
            <h2 className="text-gray-600 flex  items-center  gap-x-2 justify-center mb-12 text-2xl md:text-4xl">
              Our Items
              <MdOutlineRestaurantMenu size={36} className="text-orange-500" />
            </h2>
            <div className="w-full h-auto flex flex-wrap gap-7 justify-center">
              {items?.map((item, i) => (
                <FoodCard key={i} data={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;

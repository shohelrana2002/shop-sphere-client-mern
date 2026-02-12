import React, { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiX,
  FiShoppingCart,
  FiLogOut,
  FiMapPin,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../App";
import { setUser } from "../redux/userSlice";
import toast from "react-hot-toast";
import { FaCartPlus, FaHourglassHalf } from "react-icons/fa";
import { ClipboardList } from "lucide-react";

const Nav = () => {
  const navigate = useNavigate();
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user,
  );
  const { myShopData } = useSelector((state) => state.owner);
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);
  // outside click close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const dispatch = useDispatch();
  // handle logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${serverURL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUser(null));
      toast.success(data?.message || "Logout success");
    } catch (error) {
      console.log(error);
    }
  };
  /*============= Search Handle Add =========== */
  const handleSearchItems = async () => {
    try {
      const { data } = await axios.get(
        `${serverURL}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true },
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleSearchItems();
  }, [query]);
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fff9f6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* LEFT → Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl cursor-pointer  font-bold text-gray-800"
        >
          Shop<span className="text-orange-500">Sphere</span>
        </h1>
        {currentCity && userData?.role === "user" && (
          <span className="flex flex-col text-orange-500 items-center text-sm">
            <FiMapPin />
            {currentCity}
          </span>
        )}
        {/* CENTER → Search (md+) */}
        {userData?.role === "user" && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-lg">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2 border rounded-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
              {query && (
                <FiX
                  onClick={() => setQuery(query.slice(0, -1))}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-red-500"
                />
              )}
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Mobile Search Icon */}
          {userData?.role === "user" && (
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileSearchOpen ? <FiX size={22} /> : <FiSearch size={22} />}
            </button>
          )}
          {/* owner nav */}
          {userData?.role === "owner" && (
            <>
              {myShopData && (
                <>
                  <Link
                    to={"/add-food-item"}
                    className=" text-gray-700 inline-flex items-center gap-0 md:gap-1 hover:text-orange-500 font-medium"
                  >
                    <FaCartPlus size={20} />
                    <span className="hidden md:block">Add Food</span>
                  </Link>
                  <Link
                    to={"/mangeOrders"}
                    className=" text-gray-700 inline-flex items-center gap-0 md:gap-1 hover:text-orange-500 font-medium"
                  >
                    <ClipboardList size={20} className="text-orange-600" />
                    <span className="hidden md:block">Mange Orders</span>
                  </Link>
                </>
              )}

              <Link className="relative cursor-pointer inline-flex items-center hover:text-orange-600">
                <FaHourglassHalf className="text-yellow-500 " size={22} />
                <span className="hidden md:block">Order Pending</span>
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
                  2
                </span>
              </Link>
            </>
          )}

          {/* My Orders */}
          {userData?.role === "user" && (
            <>
              <Link
                to={"/myOrders"}
                className="hidden md:block text-gray-700 hover:text-orange-500 font-medium"
              >
                My Orders
              </Link>

              {/* Cart */}
              <Link
                to={"/cart"}
                className="relative cursor-pointer hover:text-orange-600"
              >
                <FiShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
                  {cartItems?.length}
                </span>
              </Link>
            </>
          )}

          {/* Profile */}
          <div className="relative">
            <p
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full
              bg-linear-to-br from-orange-400 to-orange-600
              text-white font-semibold shadow-md hover:scale-105 transition"
            >
              {userData?.fullName?.slice(0, 1).toUpperCase()}
            </p>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border overflow-hidden">
                <button className="w-full cursor-pointer text-left px-4 py-2 hover:bg-orange-200 transition">
                  👤 Profile
                </button>
                {userData?.role === "user" && (
                  <Link
                    to={"/myOrders"}
                    className="w-full cursor-pointer md:hidden text-left px-4 py-2 hover:bg-orange-200 transition"
                  >
                    🛒 My Orders
                  </Link>
                )}
                <button className="w-full cursor-pointer text-left px-4 py-2 hover:bg-orange-200 transition">
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex cursor-pointer items-center px-4 py-2 text-red-700 hover:bg-red-200 transition"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH INPUT */}
      {userData?.role === "user" && mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2 border rounded-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {query && (
              <FiX
                onClick={() => {
                  setQuery("");
                  setMobileSearchOpen(false);
                }}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;

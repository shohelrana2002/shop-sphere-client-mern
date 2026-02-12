import { useState } from "react";
import { NavLink } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Wallet,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium
      ${
        isActive
          ? "bg-orange-500 text-white shadow"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default function DeliveryNavbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
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
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-transparent  border-b border-orange-300/80 ">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          ShopSphere
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavItem
            to="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <NavItem
            to="/delivery/orders"
            icon={<Package size={18} />}
            label="My Deliveries"
          />
          <NavItem
            to="/delivery/earnings"
            icon={<Wallet size={18} />}
            label="Earnings"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Online Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-green-100/70 backdrop-blur-md text-green-700 px-3 py-1 rounded-full text-sm font-semibold shadow">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online
          </div>

          {/* Profile */}
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition">
            <User size={18} />
          </div>
          <div
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition"
          >
            <LogOut size={18} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 dark:text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-t border-white/20"
          >
            <div className="flex flex-col p-4 gap-2">
              <NavItem
                to="/"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                onClick={() => setOpen(false)}
              />
              <NavItem
                to="/delivery/orders"
                icon={<Package size={18} />}
                label="My Deliveries"
                onClick={() => setOpen(false)}
              />
              <NavItem
                to="/delivery/earnings"
                icon={<Wallet size={18} />}
                label="Earnings"
                onClick={() => setOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

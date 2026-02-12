import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../../Dashboard/UserDashboard/UserDashboard";
import OwnerDashboard from "../../Dashboard/OwnerDashboard/OwnerDashboard";
import DeliveryBoyDashboard from "../../Dashboard/DeliveryBoyDashboard/DeliveryBoyDashboard";

const Home = () => {
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  if (!userData) return null;
  return (
    <div className="min-h-screen w-full pt-32 flex flex-col items-center bg-linear-to-b from-orange-50 to-orange-100">
      {userData?.role === "user" && <UserDashboard />}
      {userData?.role === "owner" && <OwnerDashboard />}
      {userData?.role === "deliveryBoy" && <DeliveryBoyDashboard />}
    </div>
  );
};

export default Home;

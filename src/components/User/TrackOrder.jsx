import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { serverURL } from "../../App";
import DeliveryBoyTracking from "../DeliveryBoy/DeliveryBoyTracking";
import { ArrowLeft } from "lucide-react";

const TrackOrder = () => {
  const { id } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);

  const getOrderById = async () => {
    try {
      const { data } = await axios.get(
        `${serverURL}/api/orders/get-order-by-id/${id}`,
        { withCredentials: true },
      );
      setCurrentOrder(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const navigate = useNavigate();
  if (!currentOrder) return <p className="text-center mt-10">Loading...</p>;

  const shop = currentOrder.shopOrder[0]?.shop;
  const rider = currentOrder.shopOrder[0]?.assignedDeliveryBoy;
  const items = currentOrder.shopOrder[0]?.shopOrderItem;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-100 via-orange-300-500 to-orange-300/60 py-6 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition mb-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Shop Card */}
        <div className="bg-white rounded-2xl shadow p-4 flex gap-4">
          <img
            src={shop?.image}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h2 className="font-bold text-lg">{shop?.name}</h2>
            <p className="text-xs text-gray-500">{shop?.address}</p>
          </div>
        </div>

        {/* Status */}
        <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm font-semibold text-center">
          🚚 {currentOrder.shopOrder[0]?.status}
        </div>

        {/* Rider */}
        {rider ? (
          <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{rider?.fullName}</p>
              <p className="text-xs text-gray-500">{rider?.mobile}</p>
            </div>
            <a
              href={`tel:${rider?.mobile}`}
              className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm"
            >
              Call Rider
            </a>
          </div>
        ) : (
          <div className="bg-white flex justify-center items-center p-4">
            <p className="text-amber-400 font-semibold">
              No Assigned Delivery Boy
            </p>
          </div>
        )}

        {/* Address */}
        <div className="bg-white p-4 rounded-2xl shadow text-sm">
          📍 {currentOrder.deliveryAddress?.text}
        </div>

        {/* Items */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <h3 className="font-semibold">Order Items</h3>
          {items?.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>৳ {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Payment */}
        <div className="bg-white p-4 rounded-2xl shadow text-sm space-y-1">
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="font-semibold uppercase">
              {currentOrder.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-orange-600">
              ৳ {currentOrder.totalAmount}
            </span>
          </div>
        </div>

        {/* Live Tracking Map */}
        {rider && currentOrder.shopOrder[0]?.status !== "delivered" && (
          <DeliveryBoyTracking
            data={{
              deliveryBoyLocation: {
                lat: rider?.location?.coordinates[1],
                lon: rider?.location?.coordinates[0],
              },
              customerLocation: {
                lat: currentOrder.deliveryAddress.latitude,
                lon: currentOrder.deliveryAddress.longitude,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

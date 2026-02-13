import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  CreditCard,
  Truck,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { serverURL } from "../../App";
import { clearCart } from "../../redux/userSlice";

/* ===== Map click select ===== */
const LocationPicker = ({ setAddress, setPosition }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      setAddress(data.display_name || `${lat}, ${lng}`);
    },
  });
  return null;
};

/* ===== Move map when position changes ===== */
const ChangeMapView = ({ position }) => {
  const map = useMap();
  map.flyTo(position, 14, { animate: true, duration: 1.2 });
  return null;
};

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, userData, totalAmount } = useSelector(
    (state) => state.user,
  );
  const { location, address: addressCurrent } = useSelector(
    (state) => state.map,
  );

  const [address, setAddress] = useState(addressCurrent || "");
  const [search, setSearch] = useState("");
  const [currentLoading, setCurrentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [position, setPosition] = useState([location?.lat, location?.lon]);
  //   const [loading, setLoading] = useState(false);
  //   const totalPrice = cartItems.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0,
  //   );

  const deliveryFee = totalAmount > 400 ? 0 : 60;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  /* ===== Search location ===== */
  const handleSearchLocation = async () => {
    if (!search) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${search}`,
    );
    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      setPosition([lat, lng]);
      setAddress(data[0].display_name);
    }
  };

  /* ===== Current location ===== */
  const handleCurrentLocation = () => {
    setCurrentLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        setCurrentLoading(false);
        const data = await res.json();
        setAddress(data?.display_name);
      });
    } catch (error) {
      setCurrentLoading(false);
      console.log(error);
    }
  };

  /* ===== Marker drag location ===== */
  const handleMarkerDrag = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await res.json();
    setAddress(data.display_name || `${lat}, ${lng}`);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      userData,
      address,
      location: position,
      paymentMethod,
      cartItems,
      totalAmount: Number(amountWithDeliveryFee),
    };
    try {
      const data = await axios.post(
        `${serverURL}/api/orders/place-orders`,
        orderData,
        { withCredentials: true },
      );
      if (data?.status === 201 || data?.status === 200) {
        dispatch(clearCart());
        navigate("/place-orders-success");
      }
    } catch (error) {
      console.log(error);
    }
  };
  /* =========== Handle Online Payment====== */

  const handleOnlinePayment = async () => {
    try {
      const response = await axios.post(
        `${serverURL}/api/payment/sslcommerz`,
        {
          userData,
          address,
          location: position,
          paymentMethod,
          cartItems,
          totalPrice: Number(amountWithDeliveryFee),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;

      if (data?.url) {
        // SSLCommerz payment page redirect
        window.location.href = data.url;
      } else {
        console.error("Payment URL missing:", data);
      }
    } catch (error) {
      // Full error log
      if (error.response) {
        // Server responded with status code != 2xx
        console.error(
          "Server Error:",
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        // No response received
        console.error("No response from server:", error.request);
      } else {
        // Any other error
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-100 via-orange-50 to-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 cursor-pointer hover:text-orange-600"
        >
          <ArrowLeft />
        </button>
        <h2 className="text-xl font-bold">Checkout</h2>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Address */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2">
            <MapPin size={18} /> Delivery Location
          </label>

          {/* Search */}
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location"
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSearchLocation}
              className="px-4 bg-orange-500 text-white rounded-lg"
            >
              <Search size={18} />
            </button>
          </div>

          <input
            value={address}
            readOnly
            placeholder="Selected address"
            className="w-full border rounded-lg px-4 py-2 bg-gray-50"
          />

          <button
            disabled={currentLoading}
            onClick={handleCurrentLocation}
            className="flex cursor-pointer items-center gap-2 text-sm text-orange-600"
          >
            {currentLoading ? (
              "Loading Current Location..."
            ) : (
              <>
                <Navigation size={16} /> Use current location
              </>
            )}
          </button>

          {/* Map */}
          <MapContainer
            center={position}
            zoom={13}
            className="h-64 w-full rounded-xl border"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker
              position={position}
              draggable
              eventHandlers={{ dragend: handleMarkerDrag }}
            />

            <LocationPicker setAddress={setAddress} setPosition={setPosition} />
            <ChangeMapView position={position} />
          </MapContainer>
        </div>

        {/* Payment */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
            <CreditCard size={20} className="text-primary" />
            Payment Method
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cash on Delivery */}
            <label
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition
        ${
          paymentMethod === "COD"
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="accent-green-500"
              />
              <Truck size={20} className="text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-500">
                  Pay when your order arrives
                </p>
              </div>
            </label>

            {/* Online Payment */}
            <label
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition
        ${
          paymentMethod === "ONLINE"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
                className="accent-blue-500"
              />
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Online Payment</p>
                <p className="text-sm text-gray-500">
                  Pay securely via SSLCommerz
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-orange-50 p-4 rounded-xl space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>৳ {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="mt-4 space-y-3 rounded-xl  ">
            {/* Delivery Fee */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-gray-500" />
                Delivery Fee
              </span>
              <span className="font-medium text-gray-800">
                {deliveryFee === 0 ? "Free Delivery" : ` ৳ ${deliveryFee} `}
              </span>
            </div>

            <div className="border-t border-dashed" />

            {/* Total */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-semibold text-gray-900">
                Total Payable
              </span>
              <span className="text-lg font-bold text-orange-600">
                ৳ {amountWithDeliveryFee}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            paymentMethod === "ONLINE"
              ? handleOnlinePayment()
              : handlePlaceOrder()
          }
          disabled={!address}
          className="w-full py-3 cursor-pointer bg-orange-500 text-white rounded-xl font-semibold"
        >
          {paymentMethod === "ONLINE" ? "Pay Now" : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckOut;

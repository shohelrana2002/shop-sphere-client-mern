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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";

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
  const { cartItems, userData } = useSelector((state) => state.user);
  const { location, address: addressCurrent } = useSelector(
    (state) => state.map,
  );

  const [address, setAddress] = useState(addressCurrent || "");
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [position, setPosition] = useState([location?.lat, location?.lon]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPosition([lat, lng]);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      setAddress(data?.display_name);
    });
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

  const handlePlaceOrder = () => {
    const orderData = {
      userData,
      address,
      location: position,
      paymentMethod,
      items: cartItems,
      totalPrice: Number(totalPrice),
    };
    console.log("ORDER 👉", orderData);
  };
  /* =========== Handle Online Payment====== */

  const handleOnlinePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payment/sslcommerz",
        {
          userData,
          address,
          location: position,
          paymentMethod,
          cartItems,
          totalPrice: Number(totalPrice),
        },
        {
          withCredentials: true, // cookies পাঠানোর জন্য
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
          className="text-gray-600 hover:text-orange-600"
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
            onClick={handleCurrentLocation}
            className="flex cursor-pointer items-center gap-2 text-sm text-orange-600"
          >
            <Navigation size={16} /> Use current location
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
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard size={18} /> Payment Method
          </h3>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <Truck size={16} /> Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              <CreditCard size={16} /> Online Payment
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
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-orange-600">৳ {totalPrice}</span>
          </div>
        </div>

        <button
          onClick={() =>
            paymentMethod === "ONLINE"
              ? handleOnlinePayment()
              : handlePlaceOrder()
          }
          disabled={!address}
          className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold"
        >
          {paymentMethod === "ONLINE" ? "Pay Now" : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckOut;

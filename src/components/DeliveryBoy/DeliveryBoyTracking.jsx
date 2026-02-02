import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import scooter from "../../assets/scooter.png";
import home from "../../assets/home.png";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
/* ========= distance ========= */
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // KM
};

const DeliveryBoyTracking = ({ data }) => {
  if (!data) return null;

  const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation?.lon;
  const customerLat = data?.customerLocation?.lat;
  const customerLon = data?.customerLocation?.lon;

  if (!deliveryBoyLat || !customerLat) return null;

  const riderPosition = [deliveryBoyLat, deliveryBoyLon];
  const customerPosition = [customerLat, customerLon];

  const path = [riderPosition, customerPosition];
  const distanceKm = getDistanceKm(
    deliveryBoyLat,
    deliveryBoyLon,
    customerLat,
    customerLon,
  );
  /* ========= distance Text========= */
  const distanceText =
    distanceKm < 1
      ? `${(distanceKm * 1000).toFixed(0)} meters`
      : `${distanceKm.toFixed(2)} km`;

  return (
    <div className="relative w-full h-64 mt-3 mb-12 rounded-xl overflow-hidden border shadow">
      {/* Distance Badge */}
      <div className="absolute z-1000 top-2 left-12 text-red-700 bg-white px-3 py-1 rounded-lg shadow text-xs font-semibold">
        📏 Distance: {distanceText}
      </div>

      <MapContainer
        center={riderPosition}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={riderPosition} icon={deliveryBoyIcon}>
          <Popup>DeliveryBoy</Popup>
        </Marker>

        <Marker position={customerPosition} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} pathOptions={{ color: "red", weight: 4 }} />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;

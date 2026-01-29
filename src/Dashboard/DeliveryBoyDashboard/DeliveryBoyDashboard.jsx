import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const earningsData = [
  { day: "Mon", income: 500 },
  { day: "Tue", income: 800 },
  { day: "Wed", income: 650 },
  { day: "Thu", income: 900 },
  { day: "Fri", income: 700 },
  { day: "Sat", income: 1200 },
  { day: "Sun", income: 950 },
];

const ordersData = [
  { day: "Mon", orders: 5 },
  { day: "Tue", orders: 8 },
  { day: "Wed", orders: 6 },
  { day: "Thu", orders: 9 },
  { day: "Fri", orders: 7 },
  { day: "Sat", orders: 12 },
  { day: "Sun", orders: 10 },
];

const DeliveryBoyDashboard = () => {
  return (
    <div className="min-h-screen w-full container mx-auto -mt-34 bg-linear-to-br from-slate-100 to-slate-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Delivery Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-gray-500">Today's Income</p>
          <h2 className="text-2xl font-bold text-green-600">৳ 1,250</h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-gray-500">Monthly Income</p>
          <h2 className="text-2xl font-bold text-blue-600">৳ 24,500</h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-gray-500">Delivered Orders</p>
          <h2 className="text-2xl font-bold text-purple-600">132</h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5">
          <p className="text-gray-500">Pending Deliveries</p>
          <h2 className="text-2xl font-bold text-red-500">4</h2>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="font-semibold mb-4">Weekly Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="font-semibold mb-4">Weekly Deliveries</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;

import { Navigate, Route, Routes } from "react-router";
import "./index.css";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import useGetCity from "./hooks/useGetCity";
import CreateEditShop from "./pages/shop/CreateEditShop";
import AddItem from "./pages/AddFoodItem/AddItem";
import EditFoodItem from "./pages/AddFoodItem/EditFoodItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CartPage from "./components/User/CartPage";
import CheckOut from "./components/User/CheckOut";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentFailed from "./components/Payment/PaymentFailed";
import PaymentCancel from "./components/Payment/PaymentCancel";
import MyOrders from "./components/User/MyOrders";
import PlaceOrderSuccess from "./components/Payment/PlaceOrderSuccess";
import MangeOrders from "./components/Owner/MangeOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrder from "./components/User/TrackOrder";
import Shop from "./components/User/Shop";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { setSocket } from "./redux/userSlice";
// import useGetMyOrders from "./hooks/useGetMyOrders";
export const serverURL = "http://localhost:3000";
function App() {
  const { userData, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useGetCurrentUser();
  useGetMyShop();
  useGetCity();
  useGetShopByCity();
  useGetItemsByCity();
  // useGetMyOrders();
  useUpdateLocation();
  useEffect(() => {
    const socketInstance = io(serverURL, { withCredentials: true });
    dispatch(setSocket(socketInstance));
    socketInstance.on("connect", () => {
      if (userData) {
        socketInstance.emit("identity", { userId: userData._id });
      }
    });
    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <Routes>
      //signup
      <Route
        path="/signUp"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signIn"} />}
      />
      <Route
        path="/create-edit-shop"
        element={
          userData?.role === "owner" ? (
            <CreateEditShop />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/add-food-item"
        element={
          userData?.role === "owner" ? <AddItem /> : <Navigate to={"/signIn"} />
        }
      />
      <Route
        path="/edit-food-item/:itemId"
        element={
          userData?.role === "owner" ? (
            <EditFoodItem />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/cart"
        element={
          userData?.role === "user" ? <CartPage /> : <Navigate to={"/signIn"} />
        }
      />
      <Route
        path="/checkout"
        element={
          userData?.role === "user" ? <CheckOut /> : <Navigate to={"/signIn"} />
        }
      />
      <Route
        path="/myOrders"
        element={
          userData?.role === "user" ? <MyOrders /> : <Navigate to={"/signIn"} />
        }
      />
      <Route
        path="/mangeOrders"
        element={
          userData?.role === "owner" ? (
            <MangeOrders />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/track-order/:id"
        element={
          userData?.role === "user" ? (
            <TrackOrder />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/shopBy/:shopId"
        element={
          userData?.role === "user" ? <Shop /> : <Navigate to="/signIn" />
        }
      />
      {/* Payment Routes */}
      <Route
        path="/payment-success/:tran_id"
        element={
          userData?.role === "user" ? (
            <PaymentSuccess />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/place-orders-success"
        element={
          userData?.role === "user" ? (
            <PlaceOrderSuccess />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/payment-failed"
        element={
          userData?.role === "user" ? (
            <PaymentFailed />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
      <Route
        path="/payment-cancelled"
        element={
          userData?.role === "user" ? (
            <PaymentCancel />
          ) : (
            <Navigate to={"/signIn"} />
          )
        }
      />
    </Routes>
  );
}

export default App;

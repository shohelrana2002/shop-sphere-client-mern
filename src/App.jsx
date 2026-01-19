import { Navigate, Route, Routes } from "react-router";
import "./index.css";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
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
export const serverURL = "http://localhost:3000";
function App() {
  const { userData, loading } = useSelector((state) => state.user);

  useGetCurrentUser();
  useGetMyShop();
  useGetCity();
  useGetShopByCity();
  useGetItemsByCity();

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
    </Routes>
  );
}

export default App;

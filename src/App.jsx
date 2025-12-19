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
export const serverURL = "http://localhost:3000";
function App() {
  useGetCurrentUser();
  useGetCity();
  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        path="/signup"
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
    </Routes>
  );
}

export default App;

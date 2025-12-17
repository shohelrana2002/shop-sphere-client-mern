import { Route, Routes } from "react-router";
import "./index.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
export const serverURL = "http://localhost:3000";
function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;

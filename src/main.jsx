import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./utils/AuthContext.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import "./index.css";
import Login from "./Login.jsx";
import Register from "./pages/Register.jsx";
import MainPage from "./pages/MainPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    <PrivateRoute>
      <UserProfile />
    </PrivateRoute>
  </AuthProvider>
  </BrowserRouter>
);

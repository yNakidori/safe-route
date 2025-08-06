import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./utils/AuthContext.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import ProfileRoute from "./utils/ProfileRoute.jsx";
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
        <Route path="/register" element={<Register />} />
        {/* Apenas logado */}
        <Route
          path="/completar-perfil"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        {/* Login + perfil completo */}
        <Route
          path="/main"
          element={
            <PrivateRoute requireProfileComplete={true}>
              <MainPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

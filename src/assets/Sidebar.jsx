import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { db, auth } from "../firebase/firebase.config";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  const fetchProfile = async () => {
    if (!user) return null;
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col justify-between shadow-xl">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Safe Route</h1>
        </div>

        <nav className="space-y-2">
          <a
            href="/main"
            className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5v14M16 5v14"
              />
            </svg>
            Seu Espaço
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Guia
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Turismo
          </a>

          <a
            href="/user-profile"
            className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Perfil
          </a>
        </nav>
      </div>

      <div className="p-6 border-t border-slate-700">
        {user && (
          <div className="mb-4 p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center mb-2">
              <div>
                <p className="text-sm text-white font-medium">
                  {user.displayName || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-400 max-w-[140px] truncate overflow-hidden">
                  {user.email}
                </p>
              </div>
            </div>
            {userProfile && userProfile.phone && (
              <p className="text-xs text-gray-400 ml-2 mb-2">
                📞 {userProfile.phone}
              </p>
            )}
            {userProfile && userProfile.address && (
              <p className="text-xs text-gray-400 ml-2">
                📍 {userProfile.address}
              </p>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-950 rounded-lg transition-all duration-200 group"
        >
          <svg
            className="w-4 h-4 mr-2 text-gray-400 group-hover:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

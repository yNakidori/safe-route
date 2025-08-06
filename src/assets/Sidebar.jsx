import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export default function Sidebar() {

  const handleLogout = async () => {
  }

  const handleStatus = async () => {
  }

  const fetchProfile = async () => {
  }

  return (
    <div className="h-screen w-64 bg-gray-100 border-r flex flex-col justify-between">
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-6">Your App</h1>

        <nav className="space-y-4">
          <a href="#" className="text-gray-700 hover:text-purple-600 block">
            Dashboard
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-600 block">
            Files
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-600 block">
            Shared
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-600 block">
            Settings
          </a>
        </nav>
      </div>

      <div className="p-6 border-t">
        <button className="text-sm text-gray-500 hover:text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}

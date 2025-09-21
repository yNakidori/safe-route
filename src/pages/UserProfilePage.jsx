/**
 * UserProfilePage component displays and allows editing of the user's profile information,
 * including personal details, contacts, and recent routes. It fetches user data from Firebase Firestore,
 * updates user profile in Firebase Auth and Firestore, and provides UI for editing and saving changes.
 *
 * Features:
 * - Displays user profile information (name, email, phone, address, photo).
 * - Allows editing of profile details (except email).
 * - Shows a list of emergency contacts and recent routes.
 * - Integrates with Firebase Auth, Firestore, and Storage.
 * - Responsive layout with sidebar navigation.
 *
 * @component
 * @returns {JSX.Element} The rendered user profile page.
 *
 * @requires React
 * @requires firebase/firestore
 * @requires firebase/auth
 * @requires ../firebase/firebase.config
 * @requires ../utils/AuthContext
 * @requires ../assets/Sidebar
 */

import React, { useState, useEffect, use, Fragment } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../utils/AuthContext";
import Sidebar from "../assets/Sidebar";
import ProfilePictureUpload from "../utils/ProfilePictureUpload";
import AddContacts from "../utils/AddContacts";
import NotificationsPanel from "../utils/NotificationsPanel";
import toast, { Toaster } from "react-hot-toast";

export default function UserProfilePage() {
  const { user } = useAuth();
  // Sempre puxa o providerData do objeto user do Firebase Auth
  const isGoogleProvider =
    Array.isArray(user?.providerData) &&
    user.providerData.some((p) => p.providerId === "google.com");
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    photoURL: "",
  });
  const [contacts, setContacts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile({
          displayName: user.displayName || "",
          email: user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          photoURL: user.photoURL || "",
        });
        setContacts(data.contacts || []);
        setRoutes(data.routes || []);
      } else {
        setUserProfile({
          displayName: user.displayName || "",
          email: user.email || "",
          phone: "",
          address: "",
          photoURL: user.photoURL || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // envolve toda a operação em uma Promise
    toast.promise(
      (async () => {
        // Atualizar perfil do Firebase Auth
        await updateProfile(user, {
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
        });

        // Atualizar dados no Firestore
        await setDoc(
          doc(db, "users", user.uid),
          {
            displayName: userProfile.displayName,
            email: userProfile.email,
            photoURL: userProfile.photoURL,
            phone: userProfile.phone,
            address: userProfile.address,
            contacts: contacts,
            routes: routes,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        setIsEditing(false);
      })(),
      {
        loading: "Salvando perfil...",
        success: <b>Perfil atualizado com sucesso!</b>,
        error: <b>Erro ao salvar perfil</b>,
      }
    );
  };

  const handleInputChange = (field, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUploadSuccess = (newPhotoURL) => {
    setUserProfile((prev) => ({
      ...prev,
      photoURL: newPhotoURL,
    }));
    setShowPhotoUpload(false);
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <div className="fixed left-0 top-0 h-full z-10">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="fixed left-0 top-0 h-full z-10">
        <Sidebar />
      </div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    {userProfile.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {userProfile.displayName?.charAt(0) ||
                          user.email?.charAt(0)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setShowPhotoUpload(true)}
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userProfile.displayName || "Usuário"}
                  </h1>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Modal de Upload de Foto */}
          {showPhotoUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Alterar Foto de Perfil
                  </h3>
                  <button
                    onClick={() => setShowPhotoUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <ProfilePictureUpload
                  currentPhotoURL={userProfile.photoURL}
                  onUploadSuccess={handlePhotoUploadSuccess}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Informações Pessoais - ocupa 2 colunas */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
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
                Informações Pessoais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userProfile.displayName}
                      onChange={(e) =>
                        handleInputChange("displayName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {userProfile.displayName || "Não informado"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing && !isGoogleProvider ? (
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 truncate overflow-hidden">
                      {userProfile.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userProfile.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {userProfile.phone || "Não informado"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userProfile.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Rua, número, bairro, cidade"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {userProfile.address || "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contatos - ocupa 1 coluna */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Contatos ({contacts.length})
              </h2>

              <div className="space-y-3">
                {contacts.length > 0 ? (
                  contacts.slice(0, 5).map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-semibold">
                          {contact.name?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {contact.name || "Contato"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {contact.phone || contact.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum contato adicionado
                  </p>
                )}

                <button
                  className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
                  onClick={() => setShowAddContact(true)}
                >
                  + Adicionar Contato
                </button>
                <AddContacts
                  open={showAddContact}
                  onClose={() => setShowAddContact(false)}
                  currentUserId={user?.uid}
                  currentUserEmail={user?.email}
                  currentUserName={user?.displayName || user?.name || "Usuário"}
                  currentUserPhoto={
                    user?.photoURL || userProfile.photoURL || null
                  }
                />
              </div>
            </div>

            {/* Notificações - ocupa 1 coluna */}
            <NotificationsPanel userId={user?.uid} />

            {/* Rotas Recentes - ocupa todas as 4 colunas */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
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
                Rotas Recentes ({routes.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routes.length > 0 ? (
                  routes.slice(0, 6).map((route, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {route.name || `Rota ${index + 1}`}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">
                          🚀 {route.origin || "Local de origem"}
                        </p>
                        <p className="mb-1">
                          🎯 {route.destination || "Local de destino"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {route.date
                            ? new Date(route.date).toLocaleDateString()
                            : "Data não informada"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="text-center py-12">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
                      <p className="text-gray-500 mb-4">
                        Nenhuma rota encontrada
                      </p>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Criar primeira rota
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

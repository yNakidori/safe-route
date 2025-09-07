import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import toast from "react-hot-toast";

const validationSchema = Yup.object({
  searchTerm: Yup.string()
    .required("Digite um email ou telefone")
    .test(
      "email-or-phone",
      "Digite um email válido ou telefone",
      function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
});

export default function AddContacts({
  open,
  onClose,
  currentUserId,
  currentUserEmail,
  currentUserName,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const searchUser = async (searchTerm) => {
    setIsSearching(true);
    try {
      const usersRef = collection(db, "users");

      // Busca por email
      const emailQuery = query(usersRef, where("email", "==", searchTerm));
      const emailSnapshot = await getDocs(emailQuery);

      // Busca por telefone
      const phoneQuery = query(usersRef, where("phone", "==", searchTerm));
      const phoneSnapshot = await getDocs(phoneQuery);

      const results = [];

      emailSnapshot.forEach((doc) => {
        if (doc.id !== currentUserId) {
          // Não incluir o próprio usuário
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      phoneSnapshot.forEach((doc) => {
        if (
          doc.id !== currentUserId &&
          !results.find((user) => user.id === doc.id)
        ) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      setSearchResults(results);

      if (results.length === 0) {
        toast.error("Nenhum usuário encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar usuário");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const checkExistingRequest = async (fromUserId, toUserId) => {
    try {
      const requestsRef = collection(db, "contactRequests");
      const q = query(
        requestsRef,
        where("fromUserId", "==", fromUserId),
        where("toUserId", "==", toUserId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar solicitação existente:", error);
      return false;
    }
  };

  const handleSendRequest = async () => {
    if (selectedUser) {
      try {
        const existingRequest = await checkExistingRequest(
          currentUserId,
          selectedUser.id
        );
        if (existingRequest) {
          toast.error("Você já enviou uma solicitação para este usuário!");
          return;
        }

        await addDoc(collection(db, "contactRequests"), {
          fromUserId: currentUserId,
          toUserId: selectedUser.id,
          fromUserName: currentUserName,
          fromUserEmail: currentUserEmail,
          fromUserPhoto: null,
          status: "pending",
          createdAt: new Date().toISOString(),
        });

        toast.success("Solicitação de contato enviada!");
        handleClose();
      } catch (error) {
        toast.error("Erro ao enviar solicitação");
        console.error("Send request error:", error);
      }
    }
  };

  const handleClose = () => {
    setSearchResults([]);
    setSelectedUser(null);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 w-96 max-w-sm mx-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Enviar Solicitação
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100/60 hover:bg-gray-200/60 flex items-center justify-center transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 text-gray-600"
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

          <Formik
            initialValues={{ searchTerm: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => searchUser(values.searchTerm)}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Campo de busca */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por email ou telefone:
                  </label>
                  <Field
                    name="searchTerm"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="email@exemplo.com ou (11) 99999-9999"
                  />
                  <ErrorMessage
                    name="searchTerm"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Botão de busca */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSearching}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Buscar Usuário
                    </div>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Resultados da busca */}
          {searchResults.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Usuários encontrados:
              </h4>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedUser?.id === user.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 bg-white/60"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {(user.displayName || user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {user.displayName || user.name || "Usuário"}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      )}
                    </div>
                    {selectedUser?.id === user.id && (
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão de enviar solicitação */}
          {selectedUser && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSendRequest}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Enviar Solicitação
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

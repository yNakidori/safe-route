import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { FiBell } from "react-icons/fi";
import { db } from "../firebase/firebase.config";
import toast from "react-hot-toast";

export default function NotificationsPanel({ userId, onContactAdded }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Buscar solicitações de contato pendentes
      const requestsRef = collection(db, "contactRequests");
      const q = query(
        requestsRef,
        where("toUserId", "==", userId),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const contactRequests = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        contactRequests.push({
          id: doc.id,
          type: "contact_request",
          title: "Solicitação de contato",
          message: `${data.fromUserName} quer adicionar você como contato`,
          time: formatTime(data.createdAt),
          read: false,
          data: {
            requestId: doc.id,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserEmail: data.fromUserEmail,
            fromUserPhoto: data.fromUserPhoto,
          },
          createdAt: new Date(data.createdAt),
        });
      });

      setNotifications([...contactRequests]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays} dias atrás`;
  };

  const acceptContactRequest = async (notification) => {
    try {
      const {
        requestId,
        fromUserId,
        fromUserName,
        fromUserEmail,
        fromUserPhoto,
      } = notification.data;

      // Buscar dados completos do usuário que enviou a solicitação
      const fromUserDoc = await getDoc(doc(db, "users", fromUserId));
      const fromUserData = fromUserDoc.data();

      // Buscar dados do usuário atual
      const currentUserDoc = await getDoc(doc(db, "users", userId));
      const currentUserData = currentUserDoc.data();

      // Adicionar contato na lista do usuário atual
      await updateDoc(doc(db, "users", userId), {
        contacts: arrayUnion({
          id: fromUserId,
          name: fromUserName,
          email: fromUserEmail,
          phone: fromUserData?.phone || "",
          photoURL: fromUserPhoto,
          addedAt: new Date().toISOString(),
        }),
      });

      // Adicionar contato na lista do usuário que enviou a solicitação
      await updateDoc(doc(db, "users", fromUserId), {
        contacts: arrayUnion({
          id: userId,
          name:
            currentUserData?.displayName || currentUserData?.name || "Usuário",
          email: currentUserData?.email || "",
          phone: currentUserData?.phone || "",
          photoURL: currentUserData?.photoURL || null,
          addedAt: new Date().toISOString(),
        }),
      });

      // Atualizar status da solicitação
      await updateDoc(doc(db, "contactRequests", requestId), {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      });

      // Remover notificação da lista
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

      // Callback para atualizar a lista de contatos na página principal
      if (onContactAdded) {
        onContactAdded({
          id: fromUserId,
          name: fromUserName,
          email: fromUserEmail,
          phone: fromUserData?.phone || "",
          photoURL: fromUserPhoto,
        });
      }

      toast.success("Contato adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
      toast.error("Erro ao aceitar solicitação");
    }
  };

  const rejectContactRequest = async (notification) => {
    try {
      const { requestId } = notification.data;

      // Atualizar status da solicitação
      await updateDoc(doc(db, "contactRequests", requestId), {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      });

      // Remover notificação da lista
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

      toast.success("Solicitação rejeitada");
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      toast.error("Erro ao rejeitar solicitação");
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const getNotificationIcon = () => (
    <FiBell className="w-5 h-5 text-purple-600" />
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <FiBell className="w-6 h-6 text-purple-600 mr-2" />
          Notificações
        </h2>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="text-xs text-purple-600 hover:text-purple-700 font-medium mb-3 block"
        >
          Marcar todas como lidas
        </button>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                notification.read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.read ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium truncate ${
                        notification.read ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      notification.read ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>

                  {/* Botões para solicitações de contato */}
                  {notification.type === "contact_request" &&
                    !notification.read && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => acceptContactRequest(notification)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={() => rejectContactRequest(notification)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <FiBell className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Nenhuma notificação</p>
          </div>
        )}
      </div>

      {notifications.length > 4 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button className="w-full text-center text-xs text-purple-600 hover:text-purple-700 font-medium">
            Ver todas ({notifications.length})
          </button>
        </div>
      )}
    </div>
  );
}

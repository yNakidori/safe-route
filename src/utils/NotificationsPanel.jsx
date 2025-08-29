import React, { useState, useEffect, useId } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export default function NotificationsPanel({ userId }) {
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

      const mockNotifications = [
        {
          id: 1,
          type: "route",
          title: "Rota compartilhada",
          message: "João compartilhou uma rota com você",
          time: "5 min atrás",
          read: false,
          icon: "route",
          createdAt: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
          id: 2,
          type: "contact",
          title: "Novo contato adicionado",
          message: "Maria foi adicionada aos seus contatos",
          time: "1 hora atrás",
          read: false,
          icon: "user",
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
        },
        {
          id: 3,
          type: "security",
          title: "Alerta de segurança",
          message: "Área de risco detectada na sua rota",
          time: "2 horas atrás",
          read: true,
          icon: "warning",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: 4,
          type: "info",
          title: "Atualização do sistema",
          message: "Nova versão disponível com melhorias de segurança",
          time: "1 dia atrás",
          read: true,
          icon: "info",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
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

  const getNotificationIcon = (type) => {
    const iconClasses = "w-5 h-5";

    switch (type) {
      case "route":
        return (
          <svg
            className={`${iconClasses} text-blue-600`}
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
          </svg>
        );
      case "contact":
        return (
          <svg
            className={`${iconClasses} text-green-600`}
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
        );
      case "security":
        return (
          <svg
            className={`${iconClasses} text-red-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.992-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className={`${iconClasses} text-purple-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${iconClasses} text-gray-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5 5-5v5a7.5 7.5 0 0115 0z"
            />
          </svg>
        );
    }
  };

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
              d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5 5-5v5a7.5 7.5 0 0115 0z"
            />
          </svg>
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
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                notification.read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
              onClick={() => markAsRead(notification.id)}
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
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <svg
              className="w-8 h-8 mx-auto text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5 5-5v5a7.5 7.5 0 0115 0z"
              />
            </svg>
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

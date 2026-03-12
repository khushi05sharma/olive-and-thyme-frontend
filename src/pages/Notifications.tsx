import { type FC, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, Check, Trash2 } from "lucide-react";

import { mockNotifications } from "../data/mockNotifications";
import { type Notification } from "../types/notification";
import Button from "../components/common/Button";
import RecipeImage from "../components/common/RecipeImage";

// NOTIFICATIONS PAGE

const Notifications: FC = () => {
  const navigate = useNavigate();

  //STATE

  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  // Filter: 'all' or 'unread'

  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Filtered notifications based on selected filter

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [filter, notifications]);

  // Count unread notifications

  const unreadCount = notifications.filter((n) => !n.read).length;

  // HANDLERS

  // Mark single notification as read
  const markAsRead = (notificationId: string): void => {
    // Phase 1: Update local state
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    );
    // Phase 3: Send PATCH request to backend
    // await fetch(`/api/notifications/${notificationId}/read`, {
    //   method: 'PATCH'
    // });
  };

  // Mark all notifications as read
  const markAllAsRead = (): void => {
    // Phase 1: Update local state
    setNotifications(notifications.map((n) => ({ ...n, read: true })));

    // Phase 3: Send PATCH request to backend
    // await fetch('/api/notifications/mark-all-read', {
    //   method: 'PATCH'
    // });
  };

  // Delete single notification
  const deleteNotification = (notificationId: string): void => {
    if (window.confirm("Delete this notification?")) {
      // Phase 1: Remove from local state
      setNotifications(notifications.filter((n) => n.id !== notificationId));

      // Phase 3: Send DELETE request to backend
      // await fetch(`/api/notifications/${notificationId}`, {
      //   method: 'DELETE'
      // });
    }
  };

  // Handle notification click (navigate to recipe)
  const handleNotificationClick = (notification: Notification): void => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to recipe if it's a recipe-related notification
    if (notification.recipeId) {
      navigate(`/recipe/${notification.recipeId}`);
    }
  };

  // RENDER HELPER: Notification Icon

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={20} className="text-red-500" />;
      case "comment":
        return <MessageCircle size={20} className="text-blue-500" />;
      case "system":
        return <Bell size={20} className="text-primary" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  // RENDER

  return <div></div>;
};

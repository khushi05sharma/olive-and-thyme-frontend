import { type FC, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, Check } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-primary-light">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with your recipe activity
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white rounded-lg shadow-sm">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                filter === "unread"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="small"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <Check size={16} />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm">
              <div className="mb-4 text-6xl">🔔</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "When someone interacts with your recipes, you'll see it here."}
              </p>
            </div>
          ) : (
            // Notifications
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 bg-white rounded-lg shadow-sm cursor-pointer transition hover:shadow-md ${
                  !notification.read ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-full bg-primary">
                      {notification.actorName.charAt(0)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <p className="text-gray-800">
                          <span className="font-semibold">
                            {notification.actorName}
                          </span>{" "}
                          {notification.message}
                        </p>
                      </div>

                      {/* Read indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary"></div>
                      )}
                    </div>

                    {/* Recipe Preview (if applicable) */}
                    {notification.recipeId && notification.recipeImage && (
                      <div className="flex items-center gap-3 p-2 mt-2 rounded-lg bg-gray-50">
                        <RecipeImage
                          src={notification.recipeImage}
                          alt={notification.recipeTitle || "Recipe"}
                          className="object-cover w-12 h-12 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {notification.recipeTitle}
                        </span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {notification.createdAt}
                      </span>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

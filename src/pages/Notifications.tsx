import { type FC, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from "../services/authApi";
import Button from "../components/common/Button";

// Match what backend returns
interface RealNotification {
  _id: string;
  actorName: string;
  type: "like" | "comment";
  recipeId: string;
  recipeTitle: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const Notifications: FC = () => {
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();

  const [notifications, setNotifications] = useState<RealNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // ─── FETCH ON MOUNT ───────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !token) {
      navigate("/login");
      return;
    }

    const loadNotifications = async () => {
      try {
        const data = await getNotificationsApi(token);
        setNotifications(data.notifications);
        console.log(`[NOTIF] Loaded ${data.notifications.length} notifications`);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [token, isLoggedIn]);

  const filteredNotifications = useMemo(() => {
    return filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;
  }, [filter, notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─── MARK ONE READ ────────────────────────────────────────
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    if (token) await markNotificationReadApi(id, token);
  };

  // ─── MARK ALL READ ────────────────────────────────────────
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (token) await markAllNotificationsReadApi(token);
  };

  // ─── DELETE ───────────────────────────────────────────────
  const deleteNotification = async (id: string) => {
    if (!window.confirm("Delete this notification?")) return;
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (token) await deleteNotificationApi(id, token);
  };

  // ─── CLICK ────────────────────────────────────────────────
  const handleClick = async (n: RealNotification) => {
    if (!n.read) await markAsRead(n._id);
    navigate(`/recipe/${n.recipeId}`);
  };

  const getIcon = (type: string) => {
    if (type === "like")
      return <Heart size={20} className="text-red-500" />;
    if (type === "comment")
      return <MessageCircle size={20} className="text-blue-500" />;
    return <Bell size={20} className="text-primary" />;
  };

  // ─── LOADING STATE ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light">
        <div className="max-w-4xl px-4 py-8 mx-auto">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                    <div className="w-1/2 h-3 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-primary-light">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600">Stay updated with your recipe activity</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                filter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                filter === "unread" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="small" onClick={markAllAsRead} className="gap-2">
              <Check size={16} /> Mark all as read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm">
              <div className="mb-4 text-6xl">🔔</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "When someone likes or comments on your recipes, you'll see it here."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`p-4 bg-white rounded-lg shadow-sm cursor-pointer transition hover:shadow-md ${
                  !n.read ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-bold text-white rounded-full bg-primary">
                    {n.actorName.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getIcon(n.type)}
                        <p className="text-gray-800">
                          <span className="font-semibold">{n.actorName}</span>{" "}
                          {n.message}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                      )}
                    </div>

                    {/* Recipe title */}
                    <div className="px-3 py-2 mt-1 text-sm font-medium text-gray-700 rounded-lg bg-gray-50">
                      📄 {n.recipeTitle}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                      <div className="flex gap-3">
                        {!n.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
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

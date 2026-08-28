import React, { useContext, useEffect, useState } from "react";
import { X, Bell, CheckCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { userContext } from "../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import timeAgo from "../../utils/TimeAgo";

export default function Notifications() {
  const navigate = useNavigate();
  const { token, userInfo } = useContext(userContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const notifText = {
    like_post: "liked your post",
    comment_post: "commented on your post",
    share_post: "shared your post",
    follow_user: "started following you",
  };

  async function getNotifications() {
    const options = {
      method: "GET",
      url: "https://route-posts.routemisr.com/notifications?page=1&limit=10",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);

      setNotifications(data.data.notifications || []);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    getNotifications();
  }, []);

  async function markAsRead(notificationID) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationID
          ? { ...notification, isRead: true }
          : notification,
      ),
    );

    const options = {
      method: "PATCH",
      url: `https://route-posts.routemisr.com/notifications/${notificationID}/read`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.request(options);
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  }

  async function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );

    const options = {
      method: "PATCH",
      url: "https://route-posts.routemisr.com/notifications/read-all",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.request(options);
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  }

  return (
    <div className="w-full md:max-w-[90%] lg:max-w-2xl mx-auto flex justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-2xl bg-[#07110D]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="text-[#1DB854]">
              <Bell className="size-4" />
            </div>

            <h1 className="text-base sm:text-lg font-bold tracking-wide">
              Notifications
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#1DB854] text-xs font-semibold transition-all cursor-pointer"
              >
                <CheckCheck className="size-3.5" />

                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="size-8 shrink-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {error ? (
          <ErrorState />
        ) : loading ? (
          <Loading />
        ) : notifications.length === 0 ? (
          <p className="text-center font-semibold">No notifications yet</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const actor = notification.actor;
              const actorID = actor?.id || actor?._id;
              const actorPath =
                userInfo?.id === actorID ? "/profile" : `/user/${actorID}`;

              return (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-3 sm:px-4 py-3 transition-colors cursor-pointer ${
                    notification.isRead
                      ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                      : "border-[#1DB854]/20 bg-[#1DB854]/[0.06] hover:bg-[#1DB854]/[0.09]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <Link
                        to={actorPath}
                        className="size-10 sm:size-11 md:size-12 rounded-full bg-[#112B22] border border-[#1DB854]/40 flex items-center justify-center shrink-0"
                      >
                        <img
                          src={actor?.photo || undefined}
                          alt={actor?.name}
                          className="size-full rounded-full object-cover border border-white/10"
                        />
                      </Link>

                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">
                          <Link
                            to={actorPath}
                            className="hover:text-[#1DB854] transition-colors"
                          >
                            {actor?.name}
                          </Link>{" "}
                          <span className="font-semibold hidden md:inline-block ms-3 text-[#B7BDBA]">
                            {notifText[notification.type] ||
                              "sent you a notification"}
                          </span>
                        </span>

                        <span className="text-[10px] sm:text-xs text-[#8A8F8D] truncate">
                          {timeAgo(notification.createdAt)}
                        </span>
                        <span className="font-semibold block md:hidden  text-[#B7BDBA]">
                          {notifText[notification.type] ||
                            "sent you a notification"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <span className="size-2 rounded-full bg-[#1DB854] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

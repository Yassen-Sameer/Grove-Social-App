import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../context/UserContext";
import axios from "axios";

import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import {
  Bookmark,
  Cake,
  CalendarDays,
  Camera,
  Grid,
  KeyRound,
  User,
} from "lucide-react";
import timeAgo from "../../utils/TimeAgo";
import Post from "../../components/Post";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const [error, setErorr] = useState(false);
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken, userInfo, setUserInfo } = useContext(userContext);
  const [profilePhoto, setProfilePhoto] = useState(userInfo.photo);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const navigate = useNavigate();

  async function getUserPosts() {
    const options = {
      method: "GET",
      url: `https://route-posts.routemisr.com/posts/feed?only=following&limit=10`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setPosts(data.data.posts || []);
    } catch (error) {
      setPosts([]);
      setErorr(true);
    }
  }

  async function getUserBookMarks() {
    const options = {
      method: "GET",
      url: `https://route-posts.routemisr.com/users/bookmarks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setBookmarks(data.data.bookmarks || []);
    } catch (error) {
      setBookmarks([]);
      setErorr(true);
    }
  }

  function handlePostShared(newPost) {
    setPosts((prev) => [
      { ...newPost, _id: newPost._id || newPost.id },
      ...prev,
    ]);
  }

  const handlePostDeleted = (deletedID) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedID));
  };

  const handlePostbookmark = (bookmarkID) => {
    setBookmarks((prev) => prev.filter((p) => p.id !== bookmarkID));
  };

  async function handlePhotoChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData();

    formData.append("photo", file);

    const options = {
      method: "PUT",
      url: "https://route-posts.routemisr.com/users/upload-photo",
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setProfilePhoto(data.data.photo);
      await getUserPosts();

      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  }

  async function getProfile() {
    const options = {
      method: "GET",
      url: `https://route-posts.routemisr.com/users/profile-data`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setUserInfo(data.data.user);
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
      return data.data.user;
    } catch (error) {
      console.log({ error });
      return null;
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      await getUserPosts();
      await getUserBookMarks();
      const freshUser = await getProfile();
      setProfile(freshUser || userInfo);
      setLoading(false);
    }
    load();
  }, []);

  const myPosts = posts.filter((post) => post.user._id === userInfo.id);

  return (
    <>
      <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-8 pb-12">
          {error ? (
            <ErrorState />
          ) : (
            <>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
                      <div className="relative shrink-0">
                        <label className="relative size-24 sm:size-28 md:size-32 rounded-full overflow-hidden border-2 border-[#1DB854]/60 cursor-pointer shadow-xl hover:border-[#1DB854] transition-all block group">
                          <img
                            src={profilePhoto}
                            alt={profile.name || "User Avatar"}
                            className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity backdrop-blur-[2px]">
                            <Camera className="size-5 sm:size-6 text-[#1DB854]" />
                            <span className="text-[10px] text-white font-medium">
                              Change
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                        </label>
                      </div>

                      <div className="flex-1 w-full text-center sm:text-left space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                              {profile.name}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#8A8F8D] font-medium mt-0.5">
                              @{profile.username}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowChangePassword(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer self-center sm:self-start"
                          >
                            <KeyRound className="size-4 text-[#1DB854]" />
                            <span>Change Password</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-2.5">
                          {profile.dateOfBirth && (
                            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8A8F8D]">
                              <Cake className="size-3.5 text-[#1DB854]" />
                              {new Date(profile.dateOfBirth).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          )}

                          {profile.gender && (
                            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8A8F8D] capitalize">
                              <User className="size-3.5 text-[#1DB854]" />
                              {profile.gender}
                            </span>
                          )}

                          {profile.createdAt && (
                            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8A8F8D]">
                              <CalendarDays className="size-3.5 text-[#1DB854]" />
                              Joined {timeAgo(profile.createdAt)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/[0.03] p-3 sm:p-4 rounded-2xl border border-white/10 w-full sm:w-auto sm:flex sm:divide-x-0 sm:gap-8 sm:bg-transparent sm:border-0 sm:p-0">
                          <div className="text-center sm:text-left px-2 sm:px-0">
                            <span className="block text-base sm:text-lg md:text-xl font-bold text-white">
                              {myPosts.length ?? 0}
                            </span>
                            <span className="text-[11px] sm:text-xs text-[#8A8F8D]">
                              Posts
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/user/${userInfo.id}/followers`)
                            }
                            className="text-center sm:text-left px-2 sm:px-0 cursor-pointer"
                          >
                            <span className="block text-base sm:text-lg md:text-xl font-bold text-white">
                              {profile.followersCount || 0}
                            </span>
                            <span className="text-[11px] sm:text-xs text-[#8A8F8D]">
                              Followers
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/user/${userInfo.id}/following`)
                            }
                            className="text-center sm:text-left px-2 sm:px-0 cursor-pointer"
                          >
                            <span className="block text-base sm:text-lg md:text-xl font-bold text-white">
                              {profile.followingCount || 0}
                            </span>
                            <span className="text-[11px] sm:text-xs text-[#8A8F8D]">
                              Following
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center border-b border-white/10 pb-1">
                    <div className="flex items-center gap-2 p-1 bg-[#07110D]/60 border border-white/5 rounded-2xl backdrop-blur-md w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setActiveTab("posts");
                        }}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          activeTab === "posts"
                            ? "bg-[#1DB854] text-[#0A1F18] font-semibold shadow-md shadow-[#1DB854]/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Grid className="size-4 shrink-0" />
                        <span>Posts</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("bookmarks");
                        }}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          activeTab === "bookmarks"
                            ? "bg-[#1DB854] text-[#0A1F18] font-semibold shadow-md shadow-[#1DB854]/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Bookmark className="size-4 shrink-0" />
                        <span>Saved</span>
                      </button>
                    </div>
                  </div>

                  {activeTab === "posts" ? (
                    myPosts.length > 0 ? (
                      <div className="space-y-4 sm:space-y-6">
                        {myPosts.map((post) => (
                          <Post
                            key={post.id}
                            postID={post.id}
                            isLiked={post.likes?.includes(userInfo?.id)}
                            onDelete={handlePostDeleted}
                            isSaved={post.bookmarked}
                            commentsCount={post.commentsCount}
                            publishDate={timeAgo(post.createdAt)}
                            likesCount={post.likesCount}
                            isPublic={post.privacy}
                            isPostImg={post.image}
                            postImg={post.image}
                            publisherImg={post.user.photo}
                            publisherUserName={post.user.username}
                            publisherID={post.user._id}
                            publisherName={post.user.name}
                            postDiscribation={post.body}
                            onShare={handlePostShared}
                            isShare={post.isShare}
                            sharedPost={post.sharedPost}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 backdrop-blur-md text-center space-y-3 shadow-xl">
                        <div className="size-12 sm:size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#1DB854]">
                          <Grid className="size-6 sm:size-7" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                          No posts yet
                        </h3>
                        <p className="text-xs sm:text-sm text-[#8A8F8D] max-w-xs sm:max-w-sm mx-auto">
                          Your published posts will appear here.
                        </p>
                      </div>
                    )
                  ) : bookmarks.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {bookmarks.map((post) => (
                        <Post
                          key={post.id}
                          postID={post.id}
                          isLiked={post.likes?.includes(userInfo?.id)}
                          onDelete={handlePostDeleted}
                          isSaved={post.bookmarked}
                          commentsCount={post.commentsCount}
                          publishDate={timeAgo(post.createdAt)}
                          likesCount={post.likesCount}
                          isPublic={post.privacy}
                          isPostImg={post.image}
                          postImg={post.image}
                          publisherImg={post.user.photo}
                          publisherUserName={post.user.username}
                          publisherID={post.user._id}
                          publisherName={post.user.name}
                          postDiscribation={post.body}
                          onBookMark={handlePostbookmark}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 backdrop-blur-md text-center space-y-3 shadow-xl">
                      <div className="size-12 sm:size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#1DB854]">
                        <Bookmark className="size-6 sm:size-7" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        No saved posts
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8A8F8D] max-w-xs sm:max-w-sm mx-auto">
                        Your posts will appear here.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          token={token}
          onClose={() => setShowChangePassword(false)}
          onPasswordChanged={(newToken) => setToken(newToken)}
        />
      )}
    </>
  );
}

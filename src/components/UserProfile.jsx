import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Cake,
  CalendarDays,
  Grid,
  User,
  UserPlus,
  UserCheck,
} from "lucide-react";
import Post from "./Post";
import axios from "axios";
import Loading from "./Loading";
import ErrorState from "./ErrorState";
import timeAgo from "../utils/TimeAgo";
import { userContext } from "../context/UserContext";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, userInfo } = useContext(userContext);

  const [profile, setProfile] = useState({});
  const [followers, setFollowers] = useState(profile.followersCount || 0);
  const [followBack, setFollowBack] = useState(false);

  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handlePostDeleted = (deletedID) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedID));
  };

  async function getUserProfile() {
    try {
      const options = {
        method: "GET",
        url: `https://route-posts.routemisr.com/users/${id}/profile`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);
      setProfile(data.data.user);
      setIsFollowing(data.data.isFollowing);
      setFollowers(data.data.user.followersCount);
      console.log(data.data.user);
    } catch (error) {
      setError(true);
    }
  }

  async function getUserPosts() {
    try {
      const options = {
        method: "GET",
        url: `https://route-posts.routemisr.com/users/${id}/posts`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);
      setPosts(data.data.posts);
      setLoading(false);
    } catch (error) {
      setError(true);
    }
  }

  useEffect(() => {
    getUserProfile();
    getUserPosts();
  }, [id]);

  async function followUnfolow() {
    try {
      const options = {
        method: "PUT",
        url: `https://route-posts.routemisr.com/users/${id}/follow`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);
      setIsFollowing((prev) => !prev);
      setFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto space-y-5 sm:space-y-8 pb-12">
        {error ? (
          <ErrorState />
        ) : loading ? (
          <Loading />
        ) : (
          <>
            <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
                <div className="relative shrink-0">
                  <div className="size-24 sm:size-28 md:size-32 rounded-full overflow-hidden border-2 border-[#1DB854]/60 shadow-xl">
                    <img
                      src={profile.photo || undefined}
                      alt={profile.name || "User Avatar"}
                      className="size-full object-cover"
                    />
                  </div>
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

                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 sm:pt-0">
                      <button
                        onClick={() => followUnfolow()}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isFollowing
                            ? "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                            : "bg-[#1DB854] text-[#0A1F18] hover:bg-[#19a34a] shadow-md shadow-[#1DB854]/20"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="size-4" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="size-4" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
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
                        Joined{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          },
                        )}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/[0.03] p-3 sm:p-4 rounded-2xl border border-white/10 w-full sm:w-auto sm:flex sm:divide-x-0 sm:gap-8 sm:bg-transparent sm:border-0 sm:p-0">
                    <div className="text-center sm:text-left px-2 sm:px-0">
                      <span className="block text-base sm:text-lg md:text-xl font-bold text-white">
                        {posts.length}
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#8A8F8D]">
                        Posts
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/user/${id}/followers`)}
                      className="text-center sm:text-left px-2 sm:px-0 cursor-pointer"
                    >
                      <span className="block text-base sm:text-lg md:text-xl font-bold text-white">
                        {followers}
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#8A8F8D]">
                        Followers
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/user/${id}/following`)}
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
              <div className="flex items-center gap-2 px-6 py-2.5 bg-[#07110D]/60 border border-white/5 rounded-2xl backdrop-blur-md text-[#1DB854] font-semibold text-xs sm:text-sm">
                <Grid className="size-4 shrink-0" />
                <span>Posts</span>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {posts.map((post) => (
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
                  This user hasn't posted anything yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

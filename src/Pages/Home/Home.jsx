import React, { useContext, useEffect, useState } from "react";

import Post from "../../components/Post";
import { userContext } from "../../context/UserContext";
import axios from "axios";
import Loading from "../../components/Loading";
import timeAgo from "../../utils/TimeAgo";
import ErrorState from "../../components/ErrorState";
import WelcomeBanner from "../../components/WelcomeBanner";

export default function Home() {
  const { token, setUserInfo, userInfo, setNotifiCounter } =
    useContext(userContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handlePostDeleted = (deletedID) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedID));
  };
  function handlePostShared(newPost) {
    setPosts((prev) => [
      { ...newPost, _id: newPost._id || newPost.id },
      ...prev,
    ]);
  }

  async function getNotificationsCounter() {
    try {
      const options = {
        method: "GET",
        url: "https://route-posts.routemisr.com/notifications/unread-count",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);

      setNotifiCounter(data.data.unreadCount || 0);
    } catch (error) {
      console.log("Failed to get notifications counter:", error);
    }
  }

  async function getPosts() {
    try {
      const options = {
        method: "GET",
        url: "https://route-posts.routemisr.com/posts",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);

      setPosts(data.data.posts);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  async function getProfile() {
    const options = {
      method: "GET",
      url: "https://route-posts.routemisr.com/users/profile-data",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);

      setUserInfo(data.data.user);

      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
    } catch (error) {
      console.log("Failed to get profile:", error);
    }
  }

  useEffect(() => {
    if (!token) return;

    getPosts();
    getProfile();
    getNotificationsCounter();

    const interval = setInterval(() => {
      getNotificationsCounter();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="w-full md:max-w-[90%] lg:max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <WelcomeBanner />

      {error ? (
        <ErrorState />
      ) : loading ? (
        <h1 className="text-9xl">
          <Loading />
        </h1>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            return (
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
                shareCount={post.shareCount}
                onShare={handlePostShared}
                isShare={post.isShare}
                sharedPost={post.sharedPost}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

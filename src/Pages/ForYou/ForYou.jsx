import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { userContext } from "../../context/UserContext";
import Post from "../../components/Post";
import timeAgo from "../../utils/TimeAgo";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";

export default function ForYou() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  const { userInfo, token } = useContext(userContext);
  const navigate = useNavigate();

  async function getFeedPosts() {
    setIsLoading(true);
    setError(false);

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
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function getSuggestions() {
    try {
      const options = {
        method: "GET",
        url: "https://route-posts.routemisr.com/users/suggestions?limit=10",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);
      setSuggestions(data.data.users || data.data.suggestions || []);
    } catch (error) {
    } finally {
      setSuggestionsLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      getFeedPosts();
      getSuggestions();
    } else {
      setIsLoading(false);
      setSuggestionsLoading(false);
    }
  }, [token]);

  const otherUsersPosts = posts.filter(
    (post) => post.user?._id !== userInfo?.id,
  );

  if (isLoading) {
    return (
      <h1 className="text-9xl">
        <Loading />
      </h1>
    );
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="w-full md:max-w-[90%] lg:max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {" "}
      {!suggestionsLoading && suggestions.length > 0 && (
        <div className="xl:hidden bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-4 backdrop-blur-md shadow-xl space-y-3">
          <h2 className="text-xs sm:text-sm font-semibold text-[#8A8F8D] px-1">
            Suggestions for you
          </h2>

          <div
            className="flex items-center gap-4 overflow-x-auto pb-1"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {suggestions.map((user) => (
              <button
                key={user._id || user.id}
                type="button"
                onClick={() =>
                  navigate(
                    userInfo?.id === (user._id || user.id)
                      ? "/profile"
                      : `/user/${user._id || user.id}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer w-16"
              >
                <div className="size-14 sm:size-16 rounded-full p-[2px] bg-gradient-to-tr from-[#1DB854] to-[#0f5c2b]">
                  <div className="size-full rounded-full border-2 border-[#07110D] overflow-hidden bg-[#112B22]">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-300 truncate w-full text-center">
                  {user.username}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {otherUsersPosts.length > 0 ? (
          otherUsersPosts.map((post) => (
            <Post
              key={post._id}
              postID={post._id}
              isLiked={post.likes?.includes(userInfo?.id)}
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
          ))
        ) : (
          <div className="w-full  mx-auto px-4 py-8">
            <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl text-center space-y-4 flex flex-col items-center justify-center">
              No posts from other users right now.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

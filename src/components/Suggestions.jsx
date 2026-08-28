import React, { useContext, useEffect, useState } from "react";
import { Search, UserPlus, Loader } from "lucide-react";
import { Link } from "react-router";
import axios from "axios";
import { userContext } from "../context/UserContext";

export default function Suggestions() {
  const { token, userInfo } = useContext(userContext);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSuggestions();
    const interval = setInterval(() => {
      getSuggestions();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="hidden z-50 xl:flex flex-col justify-between w-72 bg-[#07110D]/80 border border-white/10 rounded-3xl p-5 backdrop-blur-md h-[calc(100vh-3rem)] fixed right-5 top-[50%] -translate-y-[50%] space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="flex  gap-2 items-center text-x font-semibold text-gray-300 tracking-wider uppercase px-1">
            Who to follow
            <Search className="size-4 text-[#8A8F8D]  " />
          </h3>

          {loading ? (
            <Loader className="size-6 text-[#1DB854] block m-auto animate-spin" />
          ) : error ? (
            <p className="text-[10px] text-[#8A8F8D] text-center">
              Couldn't load suggestions
            </p>
          ) : suggestions.length === 0 ? (
            <p className="text-[10px] text-[#8A8F8D] text-center">
              No suggestions right now
            </p>
          ) : (
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
              {suggestions.map((user) => {
                const suggestedID = user.id || user._id;

                return (
                  <div
                    key={suggestedID}
                    className="p-3 bg-[#112B22]/40 rounded-2xl border border-white/5 hover:border-[#1DB854]/30 transition-colors flex items-center justify-between gap-2"
                  >
                    <Link
                      to={`${
                        userInfo.id === suggestedID
                          ? `/profile`
                          : `/user/${suggestedID}`
                      }`}
                      className="flex items-center gap-2.5 min-w-0"
                    >
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="size-9 rounded-full object-cover border border-[#1DB854]/40 shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {user.name}
                        </h4>
                        <p className="text-[10px] text-[#8A8F8D] truncate">
                          @{user.username}
                        </p>
                        <p className="text-[9px] text-[#1DB854] mt-0.5">
                          {user.followersCount || 0} followers
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

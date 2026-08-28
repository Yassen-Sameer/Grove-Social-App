import React, { useContext, useEffect, useState } from "react";
import { X, Users, Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { userContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

export default function Followers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, userInfo } = useContext(userContext);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getFollowers() {
    const options = {
      method: "GET",
      url: `https://route-posts.routemisr.com/users/${id}/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setFollowers(data.data.user.followers || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to get followers");
      setLoading(false);
    }
  }

  useEffect(() => {
    getFollowers();
  }, [id]);

  return (
    <div className="w-full md:max-w-[90%] lg:max-w-2xl mx-auto flex justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-2xl bg-[#07110D]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="text-[#1DB854]">
              <Users className="size-4" />
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-wide">
              Followers
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="size-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {loading ? (
          <Loader className="size-10 text-[#1DB854] block m-auto animate-spin" />
        ) : followers.length === 0 ? (
          <p className="text-center font-semibold">No followers yet</p>
        ) : (
          <div className="space-y-2">
            {followers.map((follower) => {
              const followerID = follower.id || follower._id;

              return (
                <div
                  key={followerID}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors px-3 sm:px-4 py-3 cursor-pointer"
                >
                  <Link
                    to={
                      userInfo?.id === followerID
                        ? "/profile"
                        : `/user/${followerID}`
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-11 sm:size-12 rounded-full bg-[#112B22] border border-[#1DB854]/40 flex items-center justify-center shrink-0">
                        <img
                          src={follower.photo || undefined}
                          alt={follower.name}
                          className="size-full rounded-full object-cover border border-white/10"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate hover:text-[#1DB854] transition-colors">
                          {follower.name}
                        </span>
                        {follower.username && (
                          <span className="text-xs text-[#8A8F8D] truncate">
                            @{follower.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

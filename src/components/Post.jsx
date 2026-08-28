import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Globe2,
  Lock,
  Pencil,
  Trash2,
  Share2Icon,
  Repeat2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { userContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

export default function Post({
  postID,
  publisherImg,
  publisherName,
  publisherUserName,
  publisherID,
  publishDate,
  postDiscribation,
  isPublic,
  isSaved,
  postImg,
  isPostImg,
  likesCount,
  commentsCount,
  onDelete,
  isLiked,
  onBookMark,
  onShare,
  isShare,
  sharedPost,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { userInfo, token } = useContext(userContext);
  const [likesCounter, SetLikesCounter] = useState(likesCount);
  const [isLike, setISlike] = useState(isLiked);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isBoookMark, setIsBookMark] = useState(isSaved);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function deletePost() {
    const options = {
      method: "DELETE",
      url: `https://route-posts.routemisr.com/posts/${postID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.request(options);
      onDelete(postID);
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  }

  async function likePost() {
    const options = {
      method: "PUT",
      url: `https://route-posts.routemisr.com/posts/${postID}/like`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setISlike(data.data.liked);
      SetLikesCounter(data.data.likesCount);
    } catch (error) {
      toast.error("Failed to update like status");
    }
  }

  async function savePost() {
    const options = {
      method: "PUT",
      url: `https://route-posts.routemisr.com/posts/${postID}/bookmark`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setIsBookMark(data.data.bookmarked);
      onBookMark?.(postID);
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  }

  async function sharePost() {
    const options = {
      method: "POST",
      url: `https://route-posts.routemisr.com/posts/${postID}/share`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        body: `Sharing this great post @${publisherUserName}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      onShare?.(data.data.post);
      toast.success("Post shared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to share post");
    }
  }

  return (
    <div className="bg-[#07110D]/80 border border-white/10 rounded-3xl p-5 backdrop-blur-md space-y-4 relative">
      {likeAnimation && (
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] pointer-events-none">
          <FontAwesomeIcon
            className="text-8xl text-[#1DB854] animate-ping"
            icon={faHeartSolid}
          />
        </div>
      )}

      {isShare && (
        <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-[#8A8F8D] font-medium">
          <Repeat2 className="size-3.5 text-[#1DB854]" />
          <span>{publisherName} shared a post</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          to={`${userInfo.id === publisherID ? `/profile` : `/user/${publisherID}`}`}
        >
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={publisherImg}
              alt={publisherName}
              className="size-10 lg:size-11 rounded-full object-cover border border-white/10"
            />
            <div>
              <h4 className="text-xs hover:text-[#1DB854] lg:text-sm font-semibold text-white">
                {publisherName}
              </h4>
              <div className="flex items-center gap-1 text-[10px] lg:text-xs text-[#8A8F8D]">
                <span>{publisherUserName}</span>
                <span>• {publishDate}</span>

                {isPublic === "public" ? (
                  <Globe2 className="size-2.5 lg:size-3" />
                ) : (
                  <Lock className="size-2.5 lg:size-3" />
                )}
              </div>
            </div>
          </div>
        </Link>
        <div className="flex gap-2">
          {publisherID !== userInfo.id && (
            <button
              onClick={() => {
                savePost();
              }}
              className="hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {isBoookMark ? (
                <FontAwesomeIcon
                  className="text-xl text-[#1DB854]"
                  icon={solidBookmark}
                />
              ) : (
                <FontAwesomeIcon
                  className="text-xl text-[#8A8F8D] hover:text-white"
                  icon={regularBookmark}
                />
              )}
            </button>
          )}

          {publisherID === userInfo.id && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/5"
              >
                <MoreHorizontal className="size-4 lg:size-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0B1A14] border border-white/10 rounded-2xl shadow-xl py-1.5 z-20 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  {!isShare && (
                    <button
                      onClick={() => {
                        navigate(`/update/${postID}`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Pencil className="size-3.5 text-[#1DB854]" />
                      <span>Update Post</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      Swal.fire({
                        title:
                          "<span class='text-lg font-bold text-white'>Delete?</span>",
                        text: "Are you sure you want to delete this post?",
                        icon: "warning",
                        iconColor: "#1DB854",
                        showCancelButton: true,
                        confirmButtonText: "Yes, delete it",
                        cancelButtonText: "Cancel",
                        reverseButtons: true,

                        background: "#07110D",
                        color: "#A3F5C3",
                        customClass: {
                          popup:
                            "border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl",
                          title: "text-white font-semibold",
                          htmlContainer: "text-xs text-gray-300 mt-2",
                          confirmButton:
                            "px-5 py-2.5 bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs rounded-xl transition-all active:scale-[0.98] outline-none ml-2 cursor-pointer",
                          cancelButton:
                            "px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs rounded-xl border border-white/10 transition-all active:scale-[0.98] outline-none cursor-pointer",
                        },
                        buttonsStyling: false,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deletePost();
                        }
                      });
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isShare && sharedPost ? (
        <div className="space-y-3">
          {postDiscribation && (
            <p className="text-xs lg:text-sm text-gray-200 leading-relaxed break-words">
              {postDiscribation}
            </p>
          )}

          <Link
            to={`/post/${sharedPost._id || sharedPost.id}`}
            className="block rounded-2xl border border-white/10 p-3.5 space-y-2.5 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <img
                src={sharedPost.user?.photo}
                alt={sharedPost.user?.name}
                className="size-7 rounded-full object-cover border border-white/10"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-white">
                  {sharedPost.user?.name}
                </span>
                <span className="text-[10px] text-[#8A8F8D]">
                  @{sharedPost.user?.username}
                </span>
              </div>
            </div>

            <p className="text-xs lg:text-sm text-gray-300 leading-relaxed break-words">
              {sharedPost.body}
            </p>

            {sharedPost.image && (
              <div className="w-full rounded-xl border border-white/10 overflow-hidden max-h-[300px]">
                <img
                  src={sharedPost.image}
                  alt="shared post content"
                  className="w-full max-h-[300px] object-cover object-center"
                />
              </div>
            )}
          </Link>
        </div>
      ) : (
        <Link to={`/post/${postID}`} className="block space-y-3">
          <p className="text-xs lg:text-sm text-gray-200 leading-relaxed break-words">
            {postDiscribation}
          </p>

          {isPostImg && (
            <div className="w-full rounded-2xl border border-white/10 overflow-hidden max-h-[400px]">
              <img
                src={postImg}
                alt="post content"
                className="w-full max-h-[400px] object-cover object-center"
              />
            </div>
          )}
        </Link>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-gray-400 text-xs lg:text-sm">
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => {
              likePost();
              if (!isLike) {
                setLikeAnimation(true);
                setTimeout(() => {
                  setLikeAnimation(false);
                }, 400);
              }
            }}
            className="flex items-center gap-1.5 hover:text-[#1DB854] transition-colors cursor-pointer shrink-0"
          >
            {isLike ? (
              <FontAwesomeIcon
                className="text-2xl text-[#1DB854]"
                icon={faHeartSolid}
              />
            ) : (
              <FontAwesomeIcon className="text-2xl" icon={faHeartRegular} />
            )}
            <span className="text-[16px]">{likesCounter}</span>
          </button>

          <Link
            to={`/post/${postID}`}
            className="flex items-center gap-1.5 hover:text-[#1DB854] transition-colors cursor-pointer shrink-0"
          >
            <MessageSquare className="size-6" />
            <span className="text-[16px]">{commentsCount}</span>
          </Link>

          {publisherID !== userInfo.id && (
            <button
              onClick={() => {
                Swal.fire({
                  text: "Are you sure you want to share this post?",
                  icon: "question",
                  iconColor: "#1DB854",
                  showCancelButton: true,
                  confirmButtonText: "Yes, share it",
                  cancelButtonText: "Cancel",
                  reverseButtons: true,

                  background: "#07110D",
                  color: "#A3F5C3",
                  customClass: {
                    popup:
                      "border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl",
                    title: "text-white font-semibold",
                    htmlContainer: "text-xs text-gray-300 mt-2",
                    confirmButton:
                      "px-5 py-2.5 bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs rounded-xl transition-all active:scale-[0.98] outline-none ml-2 cursor-pointer",
                    cancelButton:
                      "px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs rounded-xl border border-white/10 transition-all active:scale-[0.98] outline-none cursor-pointer",
                  },
                  buttonsStyling: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    sharePost();
                  }
                });
              }}
              className="flex items-center gap-1.5 hover:text-[#1DB854] transition-colors cursor-pointer shrink-0"
            >
              <Share2Icon className="size-6" />
            </button>
          )}
        </div>

        <Link to={`/postlikes/${postID}`}>
          {likesCounter > 0 && (
            <div className="text-[16px] flex gap-0.5 text-[#1DB854] hover:text-[#1DB854]/50 transition-colors cursor-pointer shrink-0">
              {Array.from({ length: Math.min(likesCounter, 3) }).map((_, i) => (
                <FontAwesomeIcon key={i} icon={faHeartSolid} />
              ))}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
